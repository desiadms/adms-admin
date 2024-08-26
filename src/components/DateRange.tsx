import { Box, Input } from "@mui/joy";
import { useDateRange } from "../reports/hooks";

export function DateRange() {
  const { setLowerLimit, setUpperLimit, dateRangeInput } = useDateRange();
  const { lowerLimit, upperLimit } = dateRangeInput;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Input
        startDecorator={"from"}
        size="sm"
        type="date"
        value={lowerLimit}
        onChange={(e) => setLowerLimit(e.target.value)}
      />
      <Input
        startDecorator={"to"}
        size="sm"
        type="date"
        value={upperLimit}
        onChange={(e) => setUpperLimit(e.target.value)}
      />
    </Box>
  );
}
