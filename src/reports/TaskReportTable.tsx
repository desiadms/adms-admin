import { Box } from "@mui/joy";
import { useParams } from "@tanstack/react-router";
import {
  ColDef,
  ExcelImage,
  GetContextMenuItemsParams,
  MenuItemDef,
} from "ag-grid-community";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { Table } from "../components/Table";
import { nhost } from "../nhost";
import { useProject } from "../projects/hooks";
import { formatToEST } from "../utils";
import { useAllTasksByProject } from "./hooks";

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
        });
        const base64 = await getBase64Image(url.presignedUrl?.url || "");
        base64ImagesMap.set(task.imageId, base64);
      }),
    ) || [];

  // Wait for all promises to resolve
  await Promise.all(promises);

  return base64ImagesMap;
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
          field: "createdAt",
          headerName: "Created At (EST Time)",
          valueFormatter: (params) => {
            return formatToEST(params.value);
          },
        },
        {
          field: "latitude",
          headerName: "Latitude",
        },
        { field: "longitude", headerName: "Longitude" },
        { field: "taskId", headerName: "Task ID" },
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
          field: 'comment',
        headerName: 'Comment'
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
      ] satisfies ColDef<NonNullable<typeof rowData>[number]>[],
    [projectData],
  );

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      return [
        "copy",
        {
          name: "Export to Excel",
          action: async () => {
            const asyncBase64ImagesMap = generateBase64ImagesMap(data);

            toast.promise(asyncBase64ImagesMap, {
              loading: "Generating images...",
              success: "Images generated, exporting to Excel...",
              error: "Failed to generate images",
            });

            const base64ImagesMap = await asyncBase64ImagesMap;
            params.api.exportDataAsExcel({
              rowHeight: 200,
              addImageToCell: (rowIndex, column, value) => {
                if (column.getColId() === "imageId" && value.length) {
                  const image: ExcelImage = {
                    id: rowIndex.toString(),
                    base64: base64ImagesMap.get(value) || "",
                    imageType: "png",
                    height: 200,
                    width: 200,
                  };

                  return {
                    image,
                  };
                }
              },
            });
          },
        },
      ] satisfies (MenuItemDef | string)[];
    },
    [data],
  );

  return (
    <Box>
      <Table
        rowData={rowData}
        columnDefs={columnDefs}
        getContextMenuItems={getContextMenuItems}
      />
    </Box>
  );
}
