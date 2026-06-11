import { COLORS } from "../../theme";
import { Driver, SimulationConfig, SimulationStats } from "../../types";
import { SimulationStatus } from "../../types/statuses";
import { post } from "../../utils/post";
import { SimulationWindow } from "../SimulationWindow/SimulationWindow";
import { Donut } from "./components/Donut";
import {
  DriverBarFill,
  DriverBarTrack,
  DriverEarnings,
  DriverName,
  DriverRank,
  DriverTrips,
  DurationBlock,
  DurationLabel,
  DurationValue,
  LeftPanel,
  LegendDot,
  LegendList,
  LegendRow,
  LegendRowCount,
  LegendRowLabel,
  LegendRowLeft,
  RightPanel,
  RunAgainButton,
  StatCellBox,
  StatCellLabel,
  StatCellUnit,
  StatCellValue,
  StatCellValueRow,
  StatsGridWrapper,
  SummaryBody,
  SummaryFooter,
  SummaryHeader,
  SummaryTitle,
  TopDriversList,
  TopDriverRow,
  TopDriversSection,
  TopDriversTitle,
} from "./SimulationSummary.styled";

interface Props {
  stats: SimulationStats;
  driverList: Driver[];
  tick: number;
  config: SimulationConfig | null;
  simStatus: SimulationStatus;
}

const StatCell = ({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: string;
}) => (
  <StatCellBox>
    <StatCellLabel>{label}</StatCellLabel>
    <StatCellValueRow>
      <StatCellValue $accent={accent}>{value}</StatCellValue>
      {unit && <StatCellUnit>{unit}</StatCellUnit>}
    </StatCellValueRow>
  </StatCellBox>
);

const fmtDuration = (ticks: number) => {
  const m = Math.floor(ticks / 60);
  const s = ticks % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const SimulationSummary = ({
  stats,
  driverList,
  tick,
  config,
  simStatus,
}: Props) => {
  const fulfilled =
    stats.totalTrips > 0 ? stats.completedTrips / stats.totalTrips : 0;
  const unserved = Math.max(
    0,
    stats.totalTrips - stats.completedTrips - stats.cancelledTrips,
  );
  const driverCount = config?.driverCount ?? (driverList.length || 1);
  const tripsPerDriver = (stats.completedTrips / driverCount).toFixed(1);

  const topDrivers = [...driverList]
    .filter((d) => d.totalTripsCompleted > 0)
    .sort((a, b) => b.totalTripsCompleted - a.totalTripsCompleted)
    .slice(0, 5);

  const maxTrips = topDrivers[0]?.totalTripsCompleted ?? 1;
  const isFailed = simStatus === SimulationStatus.FAILED;

  const handleRunAgain = async () => {
    await post("reset");
  };

  return (
    <SimulationWindow>
      <SummaryHeader>
        <SummaryTitle $failed={isFailed}>
          {isFailed ? "Simulation Failed" : "Simulation Complete"}
        </SummaryTitle>
        <DurationBlock>
          <DurationValue>{fmtDuration(tick)}</DurationValue>
          <DurationLabel>SIM DURATION</DurationLabel>
        </DurationBlock>
      </SummaryHeader>

      <SummaryBody>
        <LeftPanel>
          <Donut pct={fulfilled} />

          <LegendList>
            {[
              { label: "Completed", count: stats.completedTrips, color: COLORS.green },
              { label: "Cancelled", count: stats.cancelledTrips, color: COLORS.amber },
              { label: "Unserved", count: unserved, color: COLORS.textSecondary },
            ].map(({ label, count, color }) => (
              <LegendRow key={label}>
                <LegendRowLeft>
                  <LegendDot $color={color} />
                  <LegendRowLabel>{label}</LegendRowLabel>
                </LegendRowLeft>
                <LegendRowCount>{count}</LegendRowCount>
              </LegendRow>
            ))}
          </LegendList>
        </LeftPanel>

        <RightPanel>
          <StatsGridWrapper>
            <StatCell label="Requests" value={stats.totalTrips} />
            <StatCell label="Completed" value={stats.completedTrips} accent={COLORS.green} />
            <StatCell label="Cancelled" value={stats.cancelledTrips} accent={COLORS.amber} />
            <StatCell label="Avg Wait" value={stats.averageWaitTimeSeconds.toFixed(1)} unit="s" />
            <StatCell label="Avg Trip" value={stats.averageTripDurationSeconds.toFixed(1)} unit="s" />
            <StatCell label="Unserved" value={unserved} />
            <StatCell label="Earnings" value={`$${Math.round(stats.totalEarnings)}`} accent={COLORS.green} />
            <StatCell label="Avg Fare" value={`$${stats.averageFare.toFixed(1)}`} />
            <StatCell label="Trips / Driver" value={tripsPerDriver} />
          </StatsGridWrapper>

          {topDrivers.length > 0 && (
            <TopDriversSection>
              <TopDriversTitle>TOP DRIVERS</TopDriversTitle>
              <TopDriversList>
                {topDrivers.map((d, i) => (
                  <TopDriverRow key={d.id}>
                    <DriverRank>{i + 1}</DriverRank>
                    <DriverName>{d.name}</DriverName>
                    <DriverBarTrack>
                      <DriverBarFill $widthPct={(d.totalTripsCompleted / maxTrips) * 100} />
                    </DriverBarTrack>
                    <DriverTrips>
                      {d.totalTripsCompleted} trip{d.totalTripsCompleted !== 1 ? "s" : ""}
                    </DriverTrips>
                    <DriverEarnings>${Math.round(d.totalEarnings)}</DriverEarnings>
                  </TopDriverRow>
                ))}
              </TopDriversList>
            </TopDriversSection>
          )}
        </RightPanel>
      </SummaryBody>

      <SummaryFooter>
        <RunAgainButton onClick={handleRunAgain}>Run again ↺</RunAgainButton>
      </SummaryFooter>
    </SimulationWindow>
  );
};
