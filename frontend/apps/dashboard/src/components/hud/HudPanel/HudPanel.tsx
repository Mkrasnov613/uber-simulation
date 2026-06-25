import { Driver, SimulationConfig, SimulationStats } from "../../../types";
import { DriverList } from "../DriverList/DriverList";
import { StatsGrid } from "../StatsGrid/StatsGrid";
import {
  DriverListHeader,
  DriverListLabel,
  DriverListTitle,
  HUD_WIDTH,
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
  config: SimulationConfig | null;
}

export const HudPanel = ({ stats, driverList, activeTripsCount, visible, config }: Props) => {
  if (!stats) return null;

  return (
    <PanelContainer $visible={visible}>
      <PanelHeader>
        <PanelTitleRow>
          <PanelTitle>Uber simulation</PanelTitle>
        </PanelTitleRow>
      </PanelHeader>

      <StatsWrapper>
        <StatsGrid
          stats={stats}
          driverList={driverList}
          activeTripsCount={activeTripsCount}
          config={config}
        />
      </StatsWrapper>

      <DriverListHeader>
        <DriverListLabel>SORTED BY STATUS</DriverListLabel>
        <DriverListTitle>Drivers</DriverListTitle>
      </DriverListHeader>

      <DriverList drivers={driverList} config={config} />
    </PanelContainer>
  );
};
