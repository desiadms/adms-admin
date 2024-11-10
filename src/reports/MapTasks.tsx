import { Box, Option, Select } from "@mui/joy";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { DateRange } from "../components/DateRange";
import { headerHeight, tableTopToolbarHeight } from "../globals";
import { MapButton } from "./MapButton";
import type { useAllTasksByProject } from "./hooks";

const position = [37.09024, -95.712891] satisfies LatLngTuple;

// create a market per grupedTask

type TTasks = ReturnType<typeof useAllTasksByProject>["data"];
type TaskWithCoordinates = {
	latitude: number;
	longitude: number;
} & TTasks[number];

const Icon = new L.Icon.Default();
Icon.options.shadowSize = [0, 0];

function MapMarker({ task }: { task: TaskWithCoordinates }) {
	return (
		<Marker
			icon={Icon}
			position={[task.latitude, task.longitude] as LatLngTuple}
		>
			<Popup>
				<Box>
					<Box>{task.taskName}</Box>
					<Box>lat: {task.latitude.toFixed(4)}</Box>
					<Box>lon: {task.longitude.toFixed(4)}</Box>
					<Box>by: {task.userPin?.split("@")[0]}</Box>
				</Box>
			</Popup>
		</Marker>
	);
}

function TaskTypeFilter({
	selectedTypes,
	setSelectedTypes,
	taskTypes,
}: {
	selectedTypes: string[];
	setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
	taskTypes: string[];
}) {
	return (
		<Box>
			<Select
				multiple
				size="sm"
				placeholder="All task types"
				value={selectedTypes}
				onChange={(_event, value) => setSelectedTypes(value)}
				renderValue={(selected) => (
					<Box>
						{selected.length > 1 ? (
							<Box>{selected.length} task types</Box>
						) : (
							selected.map((value) => {
								return <Box key={value.value}>{value.value}</Box>;
							})
						)}
					</Box>
				)}
			>
				{taskTypes.map((type) => (
					<Option key={type} value={type}>
						{type}
					</Option>
				))}
			</Select>
		</Box>
	);
}

export function MapTasks({
	tasks,
	isMapView,
	setIsMapView,
}: {
	tasks: TTasks;
	isMapView: boolean;
	setIsMapView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // State for selected task types

	const tasksWithCoordinates = tasks.reduce<TaskWithCoordinates[]>(
		(acc, task) => {
			const latitude = task?.latitude || task.images[0]?.latitude;
			const longitude = task?.longitude || task.images[0]?.longitude;

			if (latitude && longitude) {
				acc.push({
					...task,
					latitude,
					longitude,
				});
			}

			return acc;
		},
		[],
	);

	const taskTypes = Array.from(
		new Set(tasks.map((task) => task.__typename).filter(Boolean)),
	);
	// Filter tasks based on selected types
	const filteredTasks =
		selectedTypes.length > 0
			? tasksWithCoordinates.filter(
					(task) => task.__typename && selectedTypes.includes(task.__typename),
				) // Assuming taskType is a property in your task object
			: tasksWithCoordinates;

	return (
		<Box>
			<Box
				sx={{
					height: tableTopToolbarHeight,
					px: 1,
					gap: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						alignItems: "center",
					}}
				>
					<TaskTypeFilter
						taskTypes={taskTypes}
						selectedTypes={selectedTypes}
						setSelectedTypes={setSelectedTypes}
					/>
					<DateRange />
				</Box>
				<MapButton isMapView={isMapView} setIsMapView={setIsMapView} />
			</Box>
			<Box sx={{ position: "relative" }}>
				<MapContainer
					style={{
						height: `calc(100dvh - ${headerHeight}px - ${tableTopToolbarHeight}px)`,
					}}
					center={position}
					zoom={4}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					{filteredTasks.map((task) => (
						<MapMarker key={task.id} task={task} />
					))}
				</MapContainer>
			</Box>
		</Box>
	);
}
