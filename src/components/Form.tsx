import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Option,
  Select,
  Switch,
  Textarea,
  Typography,
} from "@mui/joy";
import { ComponentProps, forwardRef } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export const InputField = forwardRef<
  HTMLInputElement,
  {
    label?: string;
    error?: FieldError | undefined;
    type?: ComponentProps<typeof Input>["type"];
    sx?: ComponentProps<typeof FormControl>["sx"];
    endDecorator?: React.ReactNode;
  } & ReturnType<UseFormRegister<FieldValues>>
>(({ label, error, sx, ...rest }, ref) => {
  return (
    <FormControl sx={sx}>
      {label && (
        <FormLabel sx={{ textTransform: "capitalize" }}>{label}</FormLabel>
      )}
      <Input slotProps={{ input: { ref: ref } }} {...rest} />
      {error && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
});

type ControllerProps<TFields extends FieldValues> = {
  name: Path<TFields>;
  defaultValue?: string;
  rules?: RegisterOptions;
  error?: FieldError;
  control: Control<TFields>;
};

export type SelectFieldOption = {
  label: string;
  value: string | null;
};

export function SelectField<TFields extends FieldValues>({
  name,
  label,
  options,
  renderOption,
  control,
  sx,
  renderValue,
  defaultValue,
}: {
  label: string;
  multiple?: true | undefined;
  options: SelectFieldOption[];
  renderOption?: (_option: SelectFieldOption) => string;
  renderValue?: ComponentProps<typeof Select>["renderValue"];
  sx?: ComponentProps<typeof FormControl>["sx"];
} & ControllerProps<TFields>) {
  const renderOptionFn =
    renderOption || ((opt: SelectFieldOption) => opt.label);
  return (
    <FormControl sx={sx}>
      <FormLabel sx={{ textTransform: "capitalize" }}>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required: `${name} field is required` }}
        render={({ fieldState: { error }, field }) => {
          return (
            <>
              <Select
                renderValue={renderValue}
                defaultValue={defaultValue}
                onChange={(_, data) => {
                  field.onChange(data);
                }}
              >
                {options.map((opt) => {
                  const { value } = opt;
                  return (
                    <Option key={value} value={value}>
                      {renderOptionFn(opt)}
                    </Option>
                  );
                })}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </>
          );
        }}
      />
    </FormControl>
  );
}

export function SwitchField<TFields extends FieldValues>({
  name,
  label,
  control,
  onChange,
}: {
  onChange?: (value: boolean) => unknown;
  label: string;
} & ControllerProps<TFields>) {
  return (
    <FormControl>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Typography
              component="label"
              sx={{ textTransform: "capitalize" }}
              endDecorator={
                <Switch
                  checked={field.value || false}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    field.onChange(e);
                    onChange?.(newValue);
                  }}
                  sx={{ ml: 1 }}
                />
              }
            >
              {label}
            </Typography>
          );
        }}
      />
    </FormControl>
  );
}

export function PrettySwitchField<TFields extends FieldValues>({
  name,
  control,
  onChange,
  slotProps,
  color = "neutral",
  label,
}: {
  onChange?: (value: boolean) => unknown;
  label: string | ((value: boolean) => string);
  slotProps?: ComponentProps<typeof Switch>["slotProps"];
  color?: ComponentProps<typeof Switch>["color"];
} & ControllerProps<TFields>) {
  return (
    <FormControl>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <FormLabel sx={{ textTransform: "capitalize" }}>
                {typeof label === "function" ? label(field.value) : label}
              </FormLabel>
              <Switch
                color={color}
                slotProps={slotProps}
                checked={field.value || false}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  field.onChange(e);
                  onChange?.(newValue);
                }}
                sx={{
                  alignSelf: "initial",
                  "--Switch-thumbSize": "24px",
                  "--Switch-trackWidth": "60px",
                  "--Switch-trackHeight": "31px",
                }}
              />
            </Box>
          );
        }}
      />
    </FormControl>
  );
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  {
    label?: string;
    error?: FieldError | undefined;
    type?: ComponentProps<typeof Input>["type"];
    sx?: ComponentProps<typeof FormControl>["sx"];
    endDecorator?: React.ReactNode;
  } & ReturnType<UseFormRegister<FieldValues>>
>(({ label, error, sx, ...rest }, ref) => {
  return (
    <FormControl sx={sx}>
      {label && (
        <FormLabel sx={{ textTransform: "capitalize" }}>{label}</FormLabel>
      )}
      <Textarea minRows={4} slotProps={{ textarea: { ref: ref } }} {...rest} />
      {error && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
});
