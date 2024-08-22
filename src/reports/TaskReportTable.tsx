import { useMutation } from "@apollo/client";
import { Box, Button } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { ColDef, ExcelImage, GridApi } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { Table } from "../components/Table";
import { nhost } from "../nhost";
import { useProject } from "../projects/hooks";
import { dateComparator, formatToEST } from "../utils";
import {
  deleteTaskImage,
  deleteTaskMutation,
  useAllTasksByProject,
} from "./hooks";

function getBase64Image(url: string) {
  return fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );
}

const base64ImagesMap = new Map<string, string>();

async function generateBase64ImagesMap(
  data: ReturnType<typeof useAllTasksByProject>["data"],
) {
  // Flatten all tasks into a single array of promises
  const promises =
    data?.flatMap((task) =>
      task.tasks.map(async (task) => {
        if (base64ImagesMap.has(task.imageId)) return;
        const url = await nhost.storage.getPresignedUrl({
          fileId: task.imageId,
          width: 400,
        });
        const base64 = await getBase64Image(url.presignedUrl?.url || "");
        base64ImagesMap.set(task.imageId, base64);
      }),
    ) || [];

  // Wait for all promises to resolve
  await Promise.all(promises);

  return base64ImagesMap;
}

type TData = NonNullable<
  ReturnType<typeof useAllTasksByProject>["data"]
>[number]["tasks"][number];

function DeleteTaskButton(params: CustomCellRendererProps<TData>) {
  const [executeTaskMutation] = useMutation(deleteTaskMutation);
  const [executeImageMutation] = useMutation(deleteTaskImage);

  if (!params.data) return null;
  const { projectId } = params.data;

  if (!projectId) return null;

  const { imageId, taskId } = params.data;

  function onDeleteTask() {
    async function deleteTaskImage() {
      try {
        if (imageId) {
          await executeImageMutation({
            variables: {
              imageId,
            },
          });

          await nhost.storage.delete({ fileId: imageId });
        }
      } catch (e) {
        console.error(e);
      }
    }

    return new Promise((res, rej) => {
      const run = async () => {
        try {
          await deleteTaskImage();

          await executeTaskMutation({
            variables: {
              taskId: taskId,
            },
          });

          res("Task deleted");
        } catch (e) {
          rej(e);
        }
      };

      run();
    });
  }

  return (
    <Button
      size="sm"
      color="danger"
      variant="outlined"
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this task?",
        );
        if (confirm) {
          toast.promise(onDeleteTask(), {
            loading: "Deleting task...",
            success: "Task deleted",
            error: "Failed to delete task",
          });
        }
      }}
    >
      Delete Task
    </Button>
  );
}

export function TaskReportTable() {
  const { project } = useParams({ from: "/projects/$project/task-report/" });
  const projectData = useProject();
  const { data } = useAllTasksByProject(project);

  const rowData = useMemo(() => data.map((task) => task.tasks).flat(), [data]);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        { field: "taskId", headerName: "Task ID" },
        { headerName: "Project", valueGetter: () => projectData.data?.name },

        {
          field: "userPin",
          headerName: "User Pin",
          valueGetter: (params) => {
            return params.data?.userPin?.split("@")[0];
          },
        },
        { field: "taskName", headerName: "Task Name" },
        {
          field: "comment",
          headerName: "Comment",
        },
        {
          headerName: "Delete",
          cellRenderer: DeleteTaskButton,
        },
        {
          field: "createdAt",
          filter: "agDateColumnFilter",
          headerName: "Created At (EST Time)",
          filterParams: {
            comparator: dateComparator,
          },
          valueFormatter: (params) => {
            return formatToEST(params.value);
          },
        },
        {
          field: "latitude",
          headerName: "Latitude",
        },
        { field: "longitude", headerName: "Longitude" },
        {
          headerName: "Truck Number",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "truckNumber" in params.data ? params.data.truckNumber : "-";
          },
        },
        {
          headerName: "Debris Site",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "debrisSite" in params.data ? params.data.debrisSite : "-";
          },
        },
        {
          headerName: "Contractor Name",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "contractorName" in params.data
              ? params.data.contractorName
              : "-";
          },
        },
        {
          headerName: "Disposal Site",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "disposalSite" in params.data
              ? params.data.disposalSite
              : "-";
          },
        },
        {
          field: "imageId",
          headerName: "Image",
          cellRenderer: (params) => {
            if (!params.data?.imageId) return "No Image";
            const url = nhost.storage.getPublicUrl({
              fileId: params.data?.imageId,
            });

            return (
              <img src={url} alt="task" style={{ width: 100, height: 100 }} />
            );
          },
        },
        {
          headerName: "Image Link",
          valueGetter: (params) => {
            if (!params.data?.imageId) return "No Image";
            const url = nhost.storage.getPublicUrl({
              fileId: params.data?.imageId,
            });

            return url;
          },
        },
      ] satisfies ColDef<TData>[],
    [projectData],
  );

  const contextMenuItems = useCallback(
    (params) => {
      return [
        "copy",
        {
          name: "Delete Task",
          action: () => {
            const id = params.node?.data.id;
            if (id) {
              return window.open(`/projects/${project}/tasks/${id}`);
            }
          },
        },
      ];
    },
    [project],
  );

  const rightChildren = useCallback(
    (api: GridApi) => {
      async function exportToExcelCallback() {
        const asyncBase64ImagesMap = generateBase64ImagesMap(data);

        toast.promise(asyncBase64ImagesMap, {
          loading: "Generating images...",
          success: "Images generated, exporting to Excel...",
          error: "Failed to generate images",
        });

        const base64ImagesMap = await asyncBase64ImagesMap;

        api.exportDataAsExcel({
          rowHeight: 100,
          addImageToCell: (rowIndex, column, value) => {
            if (column.getColId() === "imageId" && value.length) {
              const image: ExcelImage = {
                id: rowIndex.toString(),
                base64: base64ImagesMap.get(value) || "",
                imageType: "png",
                height: 100,
                width: 100,
              };

              return {
                image,
              };
            }
          },
        });
      }

      return (
        <Button variant="outlined" size="sm" onClick={exportToExcelCallback}>
          Export to Excel
        </Button>
      );
    },
    [data],
  );

  return (
    <Box>
      <Table
        rowData={rowData}
        columnDefs={columnDefs}
        rightChildren={rightChildren}
        getContextMenuItems={contextMenuItems}
      />
    </Box>
  );
}
