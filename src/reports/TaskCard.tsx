import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { useEffect, useState } from "react";
import { nhost } from "../nhost";

export function TaskCard({ imageData }) {
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

  const createdAtDate: Date = new Date(imageData["created_at"]);
  const dateOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZoneName: "short",
  };
  const dateString = new Intl.DateTimeFormat("en-US", dateOptions).format(
    createdAtDate,
  );

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
