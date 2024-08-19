import { useMutation } from "@apollo/client";
import { Box, Button, Input } from "@mui/joy";
import { ColDef } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Table } from "../components/Table";
import { nhost } from "../nhost";
import { dateComparator, formatToEST } from "../utils";
import { deleteTaskLogMutation, useTaskLogs } from "./hooks";

type TData = NonNullable<ReturnType<typeof useTaskLogs>["data"]>[number];

function DeleteLogButton(params: CustomCellRendererProps<TData>) {
  const [executeTaskLogMutation] = useMutation(deleteTaskLogMutation);

  if (!params.data) return null;
  const { id } = params.data;

  function onDeleteTaskLog() {
    return new Promise((res, rej) => {
      const run = async () => {
        try {
          await executeTaskLogMutation({
            variables: {
              id,
            },
          });

          res("Task Log deleted");
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
          toast.promise(onDeleteTaskLog(), {
            loading: "Deleting task log...",
            success: "Task log deleted",
            error: "Failed to delete task log",
          });
        }
      }}
    >
      Delete Log
    </Button>
  );
}

function ImageFetcher() {
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 4,
      }}
    >
      <Input
        placeholder="Enter Image ID"
        value={imageId}
        onChange={(e) => setImageId(e.target.value)}
      />
      <Button
        onClick={async () => {
          const image = await nhost.storage.getPresignedUrl({
            fileId: imageId,
          });

          setImageUrl(image.presignedUrl?.url || "");
        }}
      >
        Fetch Image
      </Button>

      {imageUrl && <img width={300} src={imageUrl} alt="Fetched Image" />}
    </Box>
  );
}

export function TaskLogsTable() {
  const { data } = useTaskLogs();

  const columnDefs = useMemo(
    () =>
      [
        { field: "id", headerName: "ID", hide: true },
        { field: "user.email", headerName: "User" },
        {
          field: "created_at",
          headerName: "Created At",
          filter: "agDateColumnFilter",
          filterParams: {
            comparator: dateComparator,
          },
          valueFormatter: (params) => {
            return formatToEST(params.value);
          },
        },
        { field: "project.name", headerName: "Project ID" },
        {
          field: "data",
          headerName: "Data",
          width: 600,
          wrapText: true,
          autoHeight: true,
          valueFormatter: (params) => {
            return JSON.stringify(params.data?.data);
          },
          filterValueGetter: (params) => {
            return JSON.stringify(params.data?.data);
          },
          cellRenderer: (params) => {
            if (!params.data?.data) return "No JSON data";

            return <pre>{JSON.stringify(params.data.data, null, 4)}</pre>;
          },
        },
        { headerName: "Delete", cellRenderer: DeleteLogButton },
        { field: "type", headerName: "Type" },
      ] satisfies ColDef<NonNullable<typeof data>[number]>[],
    [],
  );

  return (
    <Box>
      <ImageFetcher />
      <Table disableSearch rowData={data} columnDefs={columnDefs} />
    </Box>
  );
}
