import { Box, Button, Input } from "@mui/joy";
import { IoRefresh } from "react-icons/io5";
import { useDateRange } from "../reports/hooks";

export function DateRange() {
  const { setLowerLimit, setUpperLimit, dateRangeInput, refreshUpperLimit } =
    useDateRange();
  const { lowerLimit, upperLimit } = dateRangeInput;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
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
      <Button
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
        variant="outlined"
        size="sm"
        onClick={refreshUpperLimit}
      >
        Refresh <IoRefresh />
      </Button>
    </Box>
  );
}
