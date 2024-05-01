import { Box } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { TreeRemovalQuery } from "src/__generated__/gql/graphql";
import { TaskCard } from "./TaskCard";
import { takenAtSteps } from "./shared";

type TTaskCardSection = {
  data: NonNullable<TreeRemovalQuery["tasks_tree_removal_by_pk"]>;
  takenAtStep: (typeof takenAtSteps)[number];
};

export function TaskCardSection({ data, takenAtStep }: TTaskCardSection) {
  const images = data["tasks_tree_removal_images"]
    .filter((imageData) => imageData["taken_at_step"] === takenAtStep)
    .map((imageData) => {
      return <TaskCard imageData={imageData} key={imageData.id}></TaskCard>;
    });

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        sx={{ mb: 2, textTransform: "capitalize" }}
        level="h3"
        component="h3"
      >
        {takenAtStep}
      </Typography>
      {images}
    </Box>
  );
}
