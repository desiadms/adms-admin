import { useMutation } from "@apollo/client";
import { Box, Button } from "@mui/joy";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useParams } from "@tanstack/react-router";
import { ColDef, GridApi } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import imageCompression, { Options } from "browser-image-compression";
import { useCallback, useMemo, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import * as R from "remeda";
import { DateRange } from "../components/DateRange";
import { Table } from "../components/Table";
import { nhost } from "../nhost";
import { useProject } from "../projects/hooks";
import {
  dateComparator,
  formatToEST,
  normalizeKeyObjectToLabel,
} from "../utils";
import {
  TDataEntry,
  deleteTaskImage,
  softDeleteTaskMutation,
  useAllTasksByProject,
} from "./hooks";

const oneMB = 1024 * 1024;

// we need to go from any format to jpg because the pdf library
// doesn't support webp. yup.
async function getBase64Image(imageUrl: string) {
  // Fetch the image as a Blob
  // Due to the following issue, chrome doesn't allow to fetch images from S3 when you fetch from img src tag and also via fetch.
  // https://serverfault.com/questions/856904/chrome-s3-cloudfront-no-access-control-allow-origin-header-on-initial-xhr-req/856948#856948
  // Adding a random query param tricks chrome to fetch the image, as it won't look at the cache (from src tag, which doesn't contain an origin)
  const response = await fetch(`${imageUrl}&trickChrome=${Date.now()}`);
  const blob = await response.blob();

  // Check the MIME type to see if it's an image
  if (!blob.type.startsWith("image/")) {
    throw new Error("The fetched resource is not an image.");
  }

  // Convert the Blob to a File
  const file = new File([blob], "image", { type: blob.type });

  const compressionOptions = {
    maxSizeMB: oneMB,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/jpeg",
  } satisfies Options;

  // Compress and convert the file to JPEG
  const compressedFile = await imageCompression(file, compressionOptions);

  // Read the compressed file as base64
  return imageCompression.getDataUrlFromFile(compressedFile);
}

const base64ImagesMap = new Map<string, string>();

async function dataBase64Enahanced(data: TDataEntry[] | undefined) {
  const promises =
    data?.map(async (task) => {
      return {
        ...task,
        images: await Promise.all(
          task.images?.map(async (image) => {
            const cachedBase64 = base64ImagesMap.get(image.id);

            if (cachedBase64)
              return {
                ...image,
                base64: cachedBase64,
              };

            const base64 = await getBase64Image(image.url || "");
            base64ImagesMap.set(image.id, base64);
            return {
              ...image,
              base64,
            };
          }),
        ),
      };
    }) || [];

  return await Promise.all(promises);
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  textAndImage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 0",
  },
  textSection: {
    width: "50%",
    display: "flex",
    gap: 4,
    overflow: "hidden",
    wordWrap: "break-word",
    flexDirection: "column",
  },
  imageSection: {
    width: "50%",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  labelValueContainer: {
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    gap: 5,
  },
  label: {
    width: 80,
    textAlign: "right",
  },
  value: {
    flex: 1,
  },
  image: {
    width: "80%",
    height: 200,
    objectFit: "contain",
  },
});

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.labelValueContainer}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function TasksForPDF({ data }: { data: TDateEntryPdf[] }) {
  if (!data) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.map((task) => {
          const taskOnlyTextContent = R.omit(task, [
            "images",
            "_deleted",
            "__typename",
            "created_at",
            "id",
            "projectId",
            "project_id",
            "user_id",
            "taskId",
          ]);
          return (
            <View>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Task ID: {task.taskId}
              </Text>
              <View style={styles.textAndImage} key={task.id}>
                <View style={styles.textSection}>
                  {Object.entries(taskOnlyTextContent)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([key, value]) => {
                      if (typeof value === "object") return null;

                      return (
                        <LabelValue
                          key={key}
                          label={normalizeKeyObjectToLabel(key)}
                          value={value?.toString() || ""}
                        />
                      );
                    })}
                </View>
                <View style={styles.imageSection}>
                  {task.images.map((image) => {
                    return (
                      <Image
                        key={image.url}
                        style={styles.image}
                        src={image.base64}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

function LoadingContent({
  disabled,
  text,
}: {
  disabled?: boolean;
  text: string;
}) {
  return (
    <Button variant="outlined" size="sm" disabled={disabled}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {text} <LoaderIcon />
      </Box>
    </Button>
  );
}

function DownloadConfirm({ data }: { data: TDateEntryPdf[] }) {
  return (
    <PDFDownloadLink
      document={<TasksForPDF data={data} />}
      fileName={`tasks-with-images-${new Date().toISOString()}.pdf`}
    >
      {({ loading }) => (
        <>
          {loading ? (
            <LoadingContent disabled={true} text="Creating PDF" />
          ) : (
            <Button variant="outlined" size="sm">
              Download Now!
            </Button>
          )}
        </>
      )}
    </PDFDownloadLink>
  );
}

type TEnhancedImage = TDataEntry["images"][number] & { base64?: string };
type TDateEntryPdf = Omit<TDataEntry, "images"> & {
  images: TEnhancedImage[];
};

function DownloadPdfTasks({ api }: { api: GridApi<TDataEntry> }) {
  const [open, setOpen] = useState<boolean>(false);
  const [gatheredData, setGatheredData] = useState<TDateEntryPdf[]>([]);

  async function gatherDataOnModalOpen() {
    const mutableData: TDataEntry[] = [];
    api.forEachNodeAfterFilterAndSort((node) => {
      if (node?.data) mutableData.push(node.data);
    });

    const enhancedData = await dataBase64Enahanced(mutableData);

    setGatheredData(enhancedData);
  }

  return (
    <>
      <Button
        variant="outlined"
        size="sm"
        onClick={() => {
          gatherDataOnModalOpen();
          setOpen(true);
        }}
      >
        Export PDF with Images
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setGatheredData([]);
          setOpen(false);
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Download PDF</DialogTitle>
          <Divider />
          <DialogContent>
            PDF being generated. It may take a few seconds.
          </DialogContent>
          <DialogActions sx={{ flexDirection: "row" }}>
            {open && gatheredData.length > 0 ? (
              <DownloadConfirm data={gatheredData} />
            ) : (
              <Box>
                <LoadingContent disabled={true} text="Preparing Data" />
              </Box>
            )}
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

function DeleteTaskButton(params: CustomCellRendererProps<TDataEntry>) {
  const [executeTaskMutation] = useMutation(softDeleteTaskMutation);
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

function TableImagesPreview(params: CustomCellRendererProps<TDataEntry>) {
  if (!params.data?.images) return "No Images";

  const urls = params.data.images.map((image) => {
    return image.url;
  });

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {urls.map((url) => (
        <img
          key={url}
          src={url}
          alt="task"
          style={{ width: 100, height: 100 }}
        />
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
          headerName: "Debris Type",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "debrisTypeName" in params.data
              ? params.data.debrisTypeName
              : "-";
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
          headerName: "Load Call",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "load_call" in params.data
              ? `${params.data.load_call}%`
              : "-";
          },
        },
        {
          headerName: "Net Cubic Yardage",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "netCubicYardage" in params.data
              ? params.data.netCubicYardage
              : "-";
          },
        },
        {
          headerName: "Disposal Site",
          valueGetter: (params) => {
            if (!params.data) return "-";
            return "disposalSiteName" in params.data
              ? params.data.disposalSiteName
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
            const urls = params.data.images.map((image) => image.url);
            return urls.join(", ");
          },
        },
      ] satisfies ColDef<TDataEntry>[],
    [projectData],
  );

  const rightChildren = useCallback((api: GridApi) => {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <DownloadPdfTasks api={api} />
        <Button
          variant="outlined"
          size="sm"
          onClick={() =>
            api.exportDataAsCsv({
              fileName: `tasks-${new Date().toISOString()}.csv`,
              columnKeys:
                api
                  ?.getColumns()
                  ?.filter((col) => {
                    const headerName = col.getColDef().headerName;
                    return (
                      headerName !== "Images" &&
                      headerName !== "Delete" &&
                      headerName !== "ID"
                    );
                  })
                  .map((col) => col.getColId()) || [],
            })
          }
        >
          Export to CSV
        </Button>
      </Box>
    );
  }, []);

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
