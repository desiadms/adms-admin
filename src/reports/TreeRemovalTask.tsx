import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import { nhost } from "../nhost";
import { useTreeRemoval } from "./hooks";

const { data } = useTreeRemoval();

export function TreeRemovalTask() {
  const [imageUrls, setImageUrls] = useState<object>({});

  useEffect(() => {
    if (data) {
      const images = data["tasks_tree_removal_images"].map(
        async (image_data) => {
          const { presignedUrl, error } = await nhost.storage.getPresignedUrl({
            fileId: image_data["id"],
          });
          if (error) {
            console.log("error: " + error);
          }
          if (presignedUrl) {
            const newImageUrl = imageUrls;
            newImageUrl[image_data["id"]] = presignedUrl.url;
            setImageUrls(newImageUrl);
          }
        },
      );
    }
  }, []);
  // render the tree removal task data in an acceptable way
  // Make it read only for now
  // the UI components that you can use come from Joy UI
  // an example
  // https://mui.com/joy-ui/react-card/

  // to display the images you need to retrieve their url by sending the images id...
  // you can use the getPresignedUrl function from the storage client
  // https://docs.nhost.io/reference/javascript/storage/get-presigned-url

  if (data) {
    const cards = data["tasks_tree_removal_images"].map((image_data) => (
      <Card>
        <h2>{image_data["taken_at_step"]}</h2>
        <img src={imageUrls[image_data["id"]]}></img>
        <pre>{JSON.stringify(image_data, null, "\t")}</pre>
        <p>
          at ({image_data.latitude},{image_data.longitude})
        </p>
      </Card>
    ));
    return { cards };
  } else {
    return <>error: no data</>;
  }
}
