import { useQuery } from "@apollo/client";
import { useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { AllTasksByProjectQuery, Images } from "../__generated__/gql/graphql";
import { graphql, readFragment } from "../graphql";
import { nhost } from "../nhost";
import { genUpperLowerDate, objectEntries, useQuerySub } from "../utils";

export type TImage = {
  id: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  taken_at_step?: string | null;
};

export const TasksCollectionFragment = graphql(/* GraphQL */ `
  fragment TasksCollectionFragment on tasks_collection {
    id
    latitude
    _deleted
    comment
    longitude
    user_id
    project {
      name
    }
    project_id
    created_at
    images: tasks_collection_images(
      where: {
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
      }
    ) {
      id
      latitude
      longitude
      created_at
      taken_at_step
    }
    debris_type_data {
      name
    }
    contractor_data {
      name
    }
    truck_data {
      truck_number
    }
    userPin: tasks_collection_user {
      email
    }
  }
`);

export const TasksDisposalFragment = graphql(/* GraphQL */ `
  fragment TasksDisposalFragment on tasks_disposal {
    id
    latitude
    _deleted
    comment
    longitude
    user_id
    project {
      name
    }
    project_id
    created_at
    images: tasks_disposal_images(
      where: {
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
      }
    ) {
      id
      latitude
      longitude
      created_at
      taken_at_step
    }
    load_call
    debris_type_data {
      name
    }
    contractor_data {
      name
    }
    disposal_site_data {
      name
    }
    truck_data {
      truck_number
      cubic_yardage
    }
    userPin: tasks_disposal_user {
      email
    }
  }
`);

export const TasksStumpRemovalFragment = graphql(/* GraphQL */ `
  fragment TasksStumpRemovalFragment on tasks_stump_removal {
    id
    project_id
    comment
    _deleted
    created_at
    user_id
    project {
      name
    }
    userPin: tasks_branch_removal_user {
      email
    }
    images: tasks_stump_removal_images(
      where: {
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
      }
    ) {
      id
      latitude
      longitude
      created_at
      taken_at_step
    }
  }
`);

export const TasksTicketingFragment = graphql(/* GraphQL */ `
  fragment TasksTicketingFragment on tasks_ticketing {
    id
    latitude
    _deleted
    comment
    user_id
    task_ticketing_name {
      name
    }
    longitude
    project {
      name
    }
    project_id
    created_at
    user_id
    userPin: tasks_ticketing_user {
      email
    }
    task_ticketing_name {
      name
    }
    images(
      where: {
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
      }
    ) {
      id
      latitude
      longitude
      created_at
    }
  }
`);

export const TasksTreeRemovalFragment = graphql(/* GraphQL */ `
  fragment TasksTreeRemovalFragment on tasks_tree_removal {
    id
    project_id
    comment
    _deleted
    created_at
    user_id
    project {
      name
    }
    userPin: tasks_tree_removal_user {
      email
    }
    images: tasks_tree_removal_images(
      where: {
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
      }
    ) {
      id
      latitude
      longitude
      created_at
      taken_at_step
    }
  }
`);

export const queryAllTasksByProjectAndUser = graphql(/* GraphQL */ `
  query AllTasksByProjectAndUser(
    $project_id: uuid!
    $user_id: uuid!
    $lowerLimit: timestamptz!
    $upperLimit: timestamptz!
  ) {
    tasks_collection(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        user_id: { _eq: $user_id }
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksCollectionFragment
    }
    tasks_disposal(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        user_id: { _eq: $user_id }
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksDisposalFragment
    }
    tasks_stump_removal(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        user_id: { _eq: $user_id }
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksStumpRemovalFragment
    }
    tasks_ticketing(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        user_id: { _eq: $user_id }
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksTicketingFragment
    }
    tasks_tree_removal(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        user_id: { _eq: $user_id }
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksTreeRemovalFragment
    }
  }
`);

export const queryAllTasksByProject = graphql(/* GraphQL */ `
  query AllTasksByProject(
    $project_id: uuid!
    $lowerLimit: timestamptz!
    $upperLimit: timestamptz!
  ) {
    tasks_collection(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksCollectionFragment
    }
    tasks_disposal(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksDisposalFragment
    }
    tasks_stump_removal(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksStumpRemovalFragment
    }
    tasks_ticketing(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksTicketingFragment
    }
    tasks_tree_removal(
      where: {
        project_id: { _eq: $project_id }
        _or: [{ _deleted: { _eq: false } }, { _deleted: { _is_null: true } }]
        created_at: { _gte: $lowerLimit, _lte: $upperLimit }
      }
    ) {
      ...TasksTreeRemovalFragment
    }
  }
`);

function genTaskCommonFields<
  T extends {
    id: string;
    project_id: string;
    comment?: string | null;
    created_at: string;
    images: Pick<Images, "id" | "latitude" | "longitude">[];
    userPin?: { email?: string | null } | null;
    taskName: string;
  } & { [key: string]: unknown },
>(task: T) {
  return {
    ...task,
    id: task.id,
    taskId: task.id,
    projectId: task.project_id,
    comment: task.comment,
    createdAt: task.created_at,
    userPin: task?.userPin?.email,
    latitude: task.latitude,
    longitude: task.longitude,
    images: task.images,
    taskName: task.taskName,
  };
}

function extractTaskLatLonFromImages(
  images: Pick<Images, "latitude" | "longitude">[] | undefined,
) {
  return {
    latitude: images?.[0]?.latitude,
    longitude: images?.[0]?.longitude,
  };
}

function enhanceImage(image: TImage) {
  return {
    ...image,
    url: nhost.storage.getPublicUrl({ fileId: image.id, width: 500 }),
  };
}

function normalizeTasks(data: AllTasksByProjectQuery | undefined) {
  if (!data) return [];
  return objectEntries(data)
    .map(([key, tasks]) => {
      if (key === "tasks_stump_removal") {
        const allImageCoordinates = tasks?.map((task) => {
          const stumpRemovalTask = readFragment(
            TasksStumpRemovalFragment,
            task,
          );
          const latLon = extractTaskLatLonFromImages(stumpRemovalTask.images);

          return genTaskCommonFields({
            ...stumpRemovalTask,
            ...latLon,
            images: stumpRemovalTask?.images.map(enhanceImage),
            taskName: "Stump Removal",
            projectName: stumpRemovalTask.project.name,
          });
        });

        return {
          label: "Stump Removal",
          key,
          tasks: allImageCoordinates,
        };
      } else if (key === "tasks_tree_removal") {
        const allImageCoordinates = tasks?.map((task) => {
          const treeRemovalTask = readFragment(TasksTreeRemovalFragment, task);

          const latLon = extractTaskLatLonFromImages(treeRemovalTask.images);

          return genTaskCommonFields({
            ...treeRemovalTask,
            ...latLon,
            images: treeRemovalTask.images.map(enhanceImage),
            taskName: "Tree Removal",
            projectName: treeRemovalTask?.project?.name,
          });
        });

        return {
          label: "Tree Removal",
          key,
          tasks: allImageCoordinates,
        };
      } else if (key === "tasks_ticketing") {
        const allImageCoordinates = tasks?.map((task) => {
          const ticketingTask = readFragment(TasksTicketingFragment, task);

          return genTaskCommonFields({
            ...ticketingTask,
            taskName: ticketingTask.task_ticketing_name.name,
            images: ticketingTask.images.map(enhanceImage),
            projectName: ticketingTask.project.name,
          });
        });

        return {
          label: "Task Ticketing",
          key,
          tasks: allImageCoordinates,
        };
      } else if (key === "tasks_collection") {
        return {
          label: "Collection",
          key,
          tasks: tasks?.map((task) => {
            const collectionTask = readFragment(TasksCollectionFragment, task);

            return genTaskCommonFields({
              ...collectionTask,
              taskName: "Collection",
              projectName: collectionTask.project.name,
              debrisTypeName: collectionTask.debris_type_data.name,
              contractorName: collectionTask.contractor_data.name,
              truckNumber: collectionTask.truck_data.truck_number,
              images: collectionTask.images.map(enhanceImage),
            });
          }),
        };
      } else if (key === "tasks_disposal") {
        return {
          label: "Disposal",
          key,
          tasks: tasks.map((task) => {
            const disposalTask = readFragment(TasksDisposalFragment, task);

            return genTaskCommonFields({
              ...disposalTask,
              taskName: "Disposal",
              images: disposalTask.images.map(enhanceImage),
              projectName: disposalTask.project.name,
              debrisTypeName: disposalTask?.debris_type_data.name,
              contractorName: disposalTask?.contractor_data?.name,
              truckNumber: disposalTask?.truck_data?.truck_number,
              disposalSiteName: disposalTask?.disposal_site_data?.name,
              loadCall: disposalTask.load_call,
              netCubicYardage:
                disposalTask?.truck_data?.cubic_yardage ||
                0 * disposalTask.load_call,
            });
          }),
        };
      }
    })
    .filter(Boolean);
}

export function useAllTasksByProjectAndUser(projectId: string, userId: string) {
  const {
    dateRangeQuery: { lowerLimit, upperLimit },
  } = useDateRange();
  const { loading, data, error } = useQuerySub(queryAllTasksByProjectAndUser, {
    variables: {
      lowerLimit,
      upperLimit,
      project_id: projectId,
      user_id: userId,
    },
    skip: !projectId || !userId,
  });

  const normalizedTasks = useMemo(() => {
    return (
      data &&
      objectEntries(data)
        .map(([key, tasks]) => {
          if (tasks === "query_root") return [];

          if (key === "tasks_collection") {
            const fragmentData = readFragment(TasksCollectionFragment, tasks);
            return (
              fragmentData?.map((task) => {
                return {
                  ...task,
                  key,
                };
              }) || []
            );
          }

          if (key === "tasks_disposal") {
            const fragmentData = readFragment(TasksDisposalFragment, tasks);
            return (
              fragmentData?.map((task) => {
                return {
                  ...task,
                  key,
                };
              }) || []
            );
          }

          if (key === "tasks_stump_removal") {
            const fragmentData = readFragment(TasksStumpRemovalFragment, tasks);

            return (
              fragmentData?.map((task) => {
                const latLon = extractTaskLatLonFromImages(task.images);
                return {
                  ...task,
                  ...latLon,
                  key,
                };
              }) || []
            );
          }

          if (key === "tasks_ticketing") {
            const fragmentData = readFragment(TasksTicketingFragment, tasks);
            return (
              fragmentData?.map((task) => {
                return {
                  ...task,
                  key,
                };
              }) || []
            );
          }

          if (key === "tasks_tree_removal") {
            const fragmentData = readFragment(TasksTreeRemovalFragment, tasks);
            return (
              fragmentData?.map((task) => {
                const latLon = extractTaskLatLonFromImages(task.images);
                return {
                  ...task,
                  ...latLon,
                  key,
                };
              }) || []
            );
          }

          return [];
        })
        .flat()
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
    );
  }, [data]);

  return { loading, data: normalizedTasks, error };
}

const dateRangeAtom = atom<{ lowerLimit: string; upperLimit: string }>(
  genUpperLowerDate(),
);

export function useDateRange() {
  const [dateRange, setDateRange] = useAtom(dateRangeAtom);

  function refreshUpperLimit() {
    const { upperLimit } = genUpperLowerDate();
    setDateRange((prev) => ({ ...prev, upperLimit }));
  }

  const dateRangeInput = useMemo(() => {
    return {
      lowerLimit: dateRange.lowerLimit.split("T")[0],
      upperLimit: dateRange.upperLimit.split("T")[0],
    };
  }, [dateRange]);

  const setLowerLimit = useCallback(
    (date: string) => {
      setDateRange((prev) => {
        const dateVal = date ?? genUpperLowerDate().lowerLimit;
        return {
          ...prev,
          lowerLimit: dateVal,
        };
      });
    },
    [setDateRange],
  );

  const setUpperLimit = useCallback(
    (date: string) => {
      setDateRange((prev) => {
        const dateVal = date
          ? dayjs(date).endOf("day").toISOString()
          : genUpperLowerDate().upperLimit;
        return {
          ...prev,
          upperLimit: dateVal,
        };
      });
    },
    [setDateRange],
  );

  return {
    dateRangeQuery: dateRange,
    dateRangeInput,
    setLowerLimit,
    setUpperLimit,
    refreshUpperLimit,
  };
}

export function useAllTasksByProject(projectId: string) {
  const {
    dateRangeQuery: { lowerLimit, upperLimit },
  } = useDateRange();

  const { loading, data, error } = useQuery(queryAllTasksByProject, {
    variables: {
      project_id: projectId,
      lowerLimit,
      upperLimit,
    },
    skip: !projectId,
  });

  const normalizedData = useMemo(() => {
    const normalizedTasks = normalizeTasks(data);
    return normalizedTasks
      .map((task) => task.tasks)
      .flat()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [data]);

  return { loading, data: normalizedData, error };
}

export const queryTreeRemoval = graphql(/* GraphQL */ `
  query TreeRemoval($id: uuid!) {
    tasks_tree_removal_by_pk(id: $id) {
      ...TasksTreeRemovalFragment
    }
  }
`);

export const queryTicketingTask = graphql(/* GraphQL */ `
  query TaskTicketing($id: uuid!) {
    tasks_ticketing_by_pk(id: $id) {
      ...TasksTicketingFragment
    }
  }
`);

export function useTreeRemovalTask() {
  const { taskId } = useParams({
    from: "/projects/$project/task-report/tree-removal/$taskId",
  });
  const { data, loading, error } = useQuerySub(queryTreeRemoval, {
    variables: {
      id: taskId,
    },
  });

  const fragmentData = readFragment(
    TasksTreeRemovalFragment,
    data?.tasks_tree_removal_by_pk,
  );

  return { data: fragmentData, loading, error };
}

export function useTicketingTask() {
  const { taskId } = useParams({
    from: "/projects/$project/task-report/ticketing/$taskId",
  });
  const { data, loading, error } = useQuerySub(queryTicketingTask, {
    variables: {
      id: taskId,
    },
  });

  const fragmentData = readFragment(
    TasksTicketingFragment,
    data?.tasks_ticketing_by_pk,
  );

  return { data: fragmentData, loading, error };
}

export const deleteTaskImage = graphql(/* GraphQL */ `
  mutation DeleteTaskImage($imageId: uuid!) {
    delete_images_by_pk(id: $imageId) {
      id
    }
  }
`);

export const softDeleteTaskMutation = graphql(/* GraphQL */ `
  mutation SoftDeleteTask($taskId: uuid!) {
    update_tasks_collection_by_pk(
      pk_columns: { id: $taskId }
      _set: { _deleted: true }
    ) {
      id
    }
    update_tasks_disposal_by_pk(
      pk_columns: { id: $taskId }
      _set: { _deleted: true }
    ) {
      id
    }
    update_tasks_stump_removal_by_pk(
      pk_columns: { id: $taskId }
      _set: { _deleted: true }
    ) {
      id
    }
    update_tasks_ticketing_by_pk(
      pk_columns: { id: $taskId }
      _set: { _deleted: true }
    ) {
      id
    }
    update_tasks_tree_removal_by_pk(
      pk_columns: { id: $taskId }
      _set: { _deleted: true }
    ) {
      id
    }
  }
`);

type TData = ReturnType<typeof useAllTasksByProject>["data"];
export type TDataEntry = NonNullable<TData>[number];
