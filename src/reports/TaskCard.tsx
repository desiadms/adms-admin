import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { useEffect, useState } from "react";
import { TreeRemovalQuery } from "src/__generated__/gql/graphql";
import { formatDate } from "src/utils";
import { nhost } from "../nhost";

type TImageData = NonNullable<
  TreeRemovalQuery["tasks_tree_removal_by_pk"]
>["tasks_tree_removal_images"][number];

function useFetchImages(imageData: TImageData) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImageUrl = async () => {
      const { presignedUrl, error } = await nhost.storage.getPresignedUrl({
        fileId: imageData["id"],
      });

      if (error) {
        throw error;
      } else {
        setImageUrl(presignedUrl.url);
      }
    };

    fetchImageUrl();
  }, [imageData]);

  return imageUrl;
}

export function TaskCard({ imageData }: { imageData: TImageData }) {
  const dateString = formatDate(imageData["created_at"]);
  const imageUrl = useFetchImages(imageData);

  return (
    <Card sx={{ width: 320 }}>
      <img src={imageUrl}></img>
      <Typography level="body-sm">
        Taken on {dateString}
        <br /> ({imageData.latitude},{imageData.longitude})
      </Typography>
    </Card>
  );
}
