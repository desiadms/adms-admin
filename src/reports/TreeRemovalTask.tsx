import { useTreeRemoval } from "./hooks";
import { TaskCard } from "./TaskCard";

export function TreeRemovalTask() {
  const { data } = useTreeRemoval();
  if (data) {
    const images = data["tasks_tree_removal_images"].map((imageData) => {
      return <TaskCard imageData={imageData} key={imageData.id}></TaskCard>;
    });
    return <>{images}</>;
  } else {
    return <>"no data"</>;
  }
}
