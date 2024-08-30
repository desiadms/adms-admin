import { useMutation } from "@apollo/client";
import { Box, Button } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import { ColDef, ExcelImage, GridApi } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { DateRange } from "../components/DateRange";
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
  const promises =
    data?.map(async (task) => {
      task.images?.map(async (image) => {
        if (base64ImagesMap.has(image.id)) return;
        const url = nhost.storage.getPublicUrl({
          fileId: image.id,
          width: 400,
        });
        const base64 = await getBase64Image(url || "");
        base64ImagesMap.set(image.id, base64);
      });
    }) || [];

  await Promise.all(promises);
  return base64ImagesMap;
}

type TData = NonNullable<
  ReturnType<typeof useAllTasksByProject>["data"]
>[number];

function DeleteTaskButton(params: CustomCellRendererProps<TData>) {
  const [executeTaskMutation] = useMutation(deleteTaskMutation);
  const [executeImageMutation] = useMutation(deleteTaskImage);

  if (!params.data) return null;
  const { projectId } = params.data;

  if (!projectId) return null;

  const { taskId, images } = params.data;

  function onDeleteTask() {
    async function deleteTaskImage() {
      try {
        if (images.length) {
          images.map(async (image) => {
            await executeImageMutation({
              variables: {
                imageId: image.id,
              },
            });

            await nhost.storage.delete({ fileId: image.id });
          });
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

function TableImagesPreview(params: CustomCellRendererProps<TData>) {
  if (!params.data?.images) return "No Images";

  const urls = params.data.images.map((image) => {
    return nhost.storage.getPublicUrl({
      fileId: image.id,
      width: 100,
    });
  });

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {urls.map((url) => (
        <img src={url} alt="task" style={{ width: 100, height: 100 }} />
      ))}
    </Box>
  );
}

export function TaskReportTable() {
  const { project } = useParams({ from: "/projects/$project/task-report/" });
  const projectData = useProject();
  const { data } = useAllTasksByProject(project);

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        { field: "taskId", headerName: "Task ID" },
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
          headerName: "Images",
          cellRenderer: TableImagesPreview,
        },
        {
          headerName: "Image Links",
          valueGetter: (params) => {
            if (!params.data?.images) return "No Image(s)";
            const urls = params.data.images.map((image) => {
              return nhost.storage.getPublicUrl({
                fileId: image.id,
              });
            });

            return urls.join(", ");
          },
        },
      ] satisfies ColDef<TData>[],
    [projectData],
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
        rowData={data}
        columnDefs={columnDefs}
        rightChildren={rightChildren}
        leftChildren={DateRange}
      />
    </Box>
  );
}
