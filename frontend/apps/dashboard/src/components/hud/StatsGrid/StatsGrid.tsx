import { Driver, DriverStatus, SimulationStats } from "../../../types";
import {
  CellLabel,
  CellPadding,
  CellUnit,
  CellValue,
  CellValueRow,
  CompletedLabel,
  CompletedRow,
  CompletedValue,
  GridCell,
  GridRoot,
  GridRow,
} from "./StatsGrid.styled";

interface Props {
  stats: SimulationStats;
  driverList: Driver[];
  activeTripsCount: number;
}

const Cell = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <CellPadding>
    <CellLabel>{label}</CellLabel>
    <CellValueRow>
      <CellValue>{value}</CellValue>
      {unit && <CellUnit>{unit}</CellUnit>}
    </CellValueRow>
  </CellPadding>
);

export const StatsGrid = ({ stats, driverList, activeTripsCount }: Props) => {
  const onTrip = driverList.filter((d) => d.status === DriverStatus.ON_TRIP).length;
  const enRoute = driverList.filter((d) => d.status === DriverStatus.EN_ROUTE_TO_PASSENGER).length;
  const online = driverList.filter((d) => d.status !== DriverStatus.OFFLINE).length;

  return (
    <GridRoot>
      <GridRow>
        <GridCell $borderRight>
          <Cell label="Active Trips" value={activeTripsCount} />
        </GridCell>
        <GridCell $borderRight>
          <Cell label="Drivers Online" value={online} />
        </GridCell>
        <GridCell>
          <Cell label="Waiting" value={stats.waitingPassengers} />
        </GridCell>
      </GridRow>

      <GridRow>
        <GridCell $borderRight>
          <Cell label="On Trip" value={onTrip} />
        </GridCell>
        <GridCell $borderRight>
          <Cell label="En Route" value={enRoute} />
        </GridCell>
        <GridCell>
          <Cell label="Avg Wait" value={stats.averageWaitTimeSeconds.toFixed(1)} unit="s" />
        </GridCell>
      </GridRow>

      <CompletedRow>
        <CompletedLabel>completed_trips</CompletedLabel>
        <CompletedValue>{String(stats.completedTrips).padStart(4, "0")}</CompletedValue>
      </CompletedRow>
    </GridRoot>
  );
};
