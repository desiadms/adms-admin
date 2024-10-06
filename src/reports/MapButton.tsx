import { Button } from "@mui/joy";

export function MapButton({
  isMapView,
  setIsMapView,
}: {
  isMapView: boolean;
  setIsMapView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button
      variant="outlined"
      size="sm"
      onClick={() => setIsMapView((prev) => !prev)}
    >
      {isMapView ? "Table View" : "Map View"}
    </Button>
  );
}
