import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Typography } from "@mui/joy";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputField } from "../components/Form";
import { inputSx, maxFormWidth } from "../globals";
import { mutationInsertTruck, useTruckById } from "./hooks";
import { truckValidation, type TruckForm } from "./utils";

function TruckForm({ truck, project }: { truck?: TruckForm; project: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TruckForm>({
    resolver: zodResolver(truckValidation),
    defaultValues: truck,
  });

  const [executeMutation] = useMutation(mutationInsertTruck);
  const navigate = useNavigate();

  async function onSubmit(data: TruckForm) {
    try {
      const res = await toast.promise(
        executeMutation({
          variables: { object: { ...data, project_id: project } },
        }),
        {
          loading: truck ? "Updating truck..." : "Creating truck...",
          success: truck ? "Truck updated" : "Truck created",
          error: truck ? "Failed to update truck" : "Failed to create truck",
        },
      );

      const projectId = res?.data?.insert_trucks_one?.project_id;

      if (!projectId) throw new Error("Cannot find project id in response");

      navigate({
        to: "/projects/$project/trucks",
        params: { project: projectId },
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          p: 4,
          maxWidth: {
            sx: "100%",
            md: maxFormWidth,
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography level="h3">Add Truck</Typography>
          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <InputField
              sx={inputSx}
              label="truck number"
              {...register("truck_number", {
                required: "Truck number is required",
              })}
              error={errors.truck_number}
            />
            <InputField
              sx={inputSx}
              label="vin number"
              {...register("vin_number", {
                required: "Vin number is required",
              })}
              error={errors.vin_number}
            />
            <InputField
              sx={inputSx}
              label="cubic yardage"
              {...register("cubic_yardage", {
                required: "Cubic yardage is required",
              })}
              error={errors.cubic_yardage}
            />
            <InputField
              sx={inputSx}
              label="driver name"
              {...register("driver_name", {
                required: "Driver name is required",
              })}
              error={errors.driver_name}
            />
            <InputField
              sx={inputSx}
              label="contractor"
              {...register("contractor", {
                required: "Contractor is required",
              })}
              error={errors.contractor}
            />
          </Box>
          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            {truck ? "Update" : "Create"} Truck
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export function Create() {
  const { project } = useParams({
    from: "/projects/$project/trucks/new-truck",
  });

  return <TruckForm project={project} />;
}

export function Edit() {
  const { project, truck } = useParams({
    from: "/projects/$project/trucks/edit-truck/$truck",
  });

  const { data, loading, error } = useTruckById(project, truck);

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return <TruckForm project={project} truck={data} />;
}
