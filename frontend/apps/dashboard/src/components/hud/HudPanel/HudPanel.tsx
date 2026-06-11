import { Driver, SimulationStats } from "../../../types";
import { DriverList } from "../DriverList/DriverList";
import { StatsGrid } from "../StatsGrid/StatsGrid";
import {
  DriverListHeader,
  DriverListLabel,
  DriverListTitle,
  HUD_WIDTH,
  LiveLabel,
  OkBadge,
  PanelContainer,
  PanelHeader,
  PanelTitle,
  PanelTitleRow,
  StatsWrapper,
} from "./HudPanel.styled";

export { HUD_WIDTH };

interface Props {
  stats: SimulationStats | null;
  driverList: Driver[];
  activeTripsCount: number;
  visible: boolean;
}

export const HudPanel = ({ stats, driverList, activeTripsCount, visible }: Props) => {
  if (!stats) return null;

  return (
    <PanelContainer $visible={visible}>
      <PanelHeader>
        <LiveLabel>LIVE · 5S ROLLING</LiveLabel>
        <PanelTitleRow>
          <PanelTitle>Fleet · City Operations</PanelTitle>
          <OkBadge>● OK</OkBadge>
        </PanelTitleRow>
      </PanelHeader>

      <StatsWrapper>
        <StatsGrid
          stats={stats}
          driverList={driverList}
          activeTripsCount={activeTripsCount}
        />
      </StatsWrapper>

      <DriverListHeader>
        <DriverListLabel>SORTED BY STATUS</DriverListLabel>
        <DriverListTitle>Drivers</DriverListTitle>
      </DriverListHeader>

      <DriverList drivers={driverList} />
    </PanelContainer>
  );
};
