import { Box } from "@mui/joy";
import { useTreeRemoval } from "./hooks";

export function TreeRemovalTask() {
  const { data } = useTreeRemoval();
  // render the tree removal task data in an acceptable way
  // Make it read only for now
  // the UI components that you can use come from Joy UI
  // an example
  // https://mui.com/joy-ui/react-card/

  // to display the images you need to retrieve their url by sending the images id...
  // you can use the getPresignedUrl function from the storage client
  // https://docs.nhost.io/reference/javascript/storage/get-presigned-url

  console.log(data);
  return (
    <Box>
      <pre>{JSON.stringify(data, null, "\t")}</pre>
    </Box>
  );
}
