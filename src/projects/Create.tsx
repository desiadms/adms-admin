import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useForm } from "react-hook-form";
import { MdBlock, MdCheck } from "react-icons/md";
import { z } from "zod";
import { ProjectsQuery } from "../__generated__/gql/graphql";
import {
  InputField,
  PrettySwitchField,
  TextAreaField,
} from "../components/Form";
import { TopNav } from "../nav/Components";

type CreateProjectForm = ProjectsQuery["projects"][number];

const projectValidation = z.object({
  name: z.string().min(3),
  poc: z.string().min(3),
  status: z.boolean().nullish(),
  contractor: z.string().min(3),
  sub_contractor: z.string().min(3),
  location: z.string().min(3),
  comment: z.string().optional(),
});

const inputWidth = 260;
const inputSx = {
  width: inputWidth,
} satisfies SxProps;

const joy4ValueInPx = 32;

// 3 inputs + 2 gaps + left and right padding
const maxFormWidth = 260 * 3 + joy4ValueInPx * 2 + joy4ValueInPx * 2;

export function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(projectValidation),
  });

  function onSubmit(data: CreateProjectForm) {
    console.log(data);
  }

  return (
    <Box>
      <TopNav />
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <InputField
              sx={inputSx}
              label="name"
              {...register("name", {
                required: "Email is required",
              })}
              error={errors.name}
            />
            <InputField
              sx={inputSx}
              label="poc"
              {...register("poc")}
              error={errors.poc}
            />
            <InputField
              sx={inputSx}
              label="contractor"
              {...register("contractor")}
              error={errors.contractor}
            />
            <InputField
              sx={inputSx}
              label="sub contractor"
              {...register("sub_contractor")}
              error={errors.sub_contractor}
            />
            <InputField
              sx={inputSx}
              label="location"
              {...register("location")}
              error={errors.location}
            />
            <PrettySwitchField
              control={control}
              label={(value) => `Status: ${value ? "Active" : "Inactive"}`}
              name="status"
              slotProps={{
                track: {
                  children: (
                    <>
                      <Box sx={{ ml: "8px", display: "flex", color: "white" }}>
                        <MdCheck size={18} />
                      </Box>
                      <Box sx={{ mr: "8px", display: "flex", color: "white" }}>
                        <MdBlock size={18} />
                      </Box>
                    </>
                  ),
                },
              }}
            />
          </Box>
          <Box sx={{ pt: 4 }}>
            <TextAreaField
              sx={{
                width: {
                  xs: "100%",
                  sm: inputWidth * 2 + joy4ValueInPx,
                },
              }}
              label="comment"
              {...register("comment")}
            />
          </Box>

          <Button sx={{ mt: 4 }} type="submit" color="success" variant="solid">
            Create Project
          </Button>
        </form>
      </Box>
    </Box>
  );
}
