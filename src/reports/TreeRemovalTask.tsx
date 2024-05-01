import { TaskCardSection } from "./TaskCardSection";
import { useTreeRemoval } from "./hooks";
import { takenAtSteps } from "./shared";

export function TreeRemovalTask() {
  const { data } = useTreeRemoval();
  if (data) {
    const treeRemovalTask = takenAtSteps.map((takenAtStep) => {
      return (
        <TaskCardSection
          data={data}
          takenAtStep={takenAtStep}
        ></TaskCardSection>
      );
    });

    return <>{treeRemovalTask}</>;
  } else {
    return <>error: no data</>;
  }
}
