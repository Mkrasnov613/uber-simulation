import styled from 'styled-components';
import { COLORS, FONT } from '../../theme';

export const SummaryHeader = styled.div`
  padding: 24px 28px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SummaryTitle = styled.div<{ $failed: boolean }>`
  color: ${p => p.$failed ? COLORS.amber : COLORS.textPrimary};
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const DurationBlock = styled.div`
  text-align: right;
`;

export const DurationValue = styled.div`
  color: ${COLORS.textPrimary};
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
`;

export const DurationLabel = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.12em;
  margin-top: 4px;
`;

export const SummaryBody = styled.div`
  display: flex;
`;

export const LeftPanel = styled.div`
  width: 200px;
  padding: 24px 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;

export const LegendList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LegendRowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const LegendDot = styled.div<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

export const LegendRowLabel = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 11px;
`;

export const LegendRowCount = styled.span`
  color: ${COLORS.textPrimary};
  font-size: 11px;
  font-weight: 600;
`;

export const RightPanel = styled.div`
  flex: 1;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const StatsGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const StatCellBox = styled.div`
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const StatCellLabel = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

export const StatCellValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
`;

export const StatCellValue = styled.span<{ $accent?: string }>`
  color: ${p => p.$accent ?? COLORS.textPrimary};
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
`;

export const StatCellUnit = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 10px;
`;

export const TopDriversSection = styled.div``;

export const TopDriversTitle = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
`;

export const TopDriversList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const TopDriverRow = styled.div`
  display: grid;
  grid-template-columns: 14px 110px 1fr 60px 40px;
  align-items: center;
  gap: 10px;
`;

export const DriverRank = styled.span`
  color: ${COLORS.textMuted};
  font-size: 10px;
`;

export const DriverName = styled.span`
  color: ${COLORS.textPrimary};
  font-size: 11px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DriverBarTrack = styled.div`
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
`;

export const DriverBarFill = styled.div<{ $widthPct: number }>`
  height: 100%;
  width: ${p => p.$widthPct}%;
  background: ${COLORS.green};
  border-radius: 2px;
  transition: width 0.6s ease;
`;

export const DriverTrips = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 10px;
  text-align: right;
`;

export const DriverEarnings = styled.span`
  color: ${COLORS.green};
  font-size: 10px;
  text-align: right;
`;

export const SummaryFooter = styled.div`
  padding: 14px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const RunAgainButton = styled.button`
  padding: 8px 20px;
  border-radius: 6px;
  background: ${COLORS.green};
  border: none;
  color: #0a0e15;
  font-size: 12px;
  font-weight: 700;
  font-family: ${FONT};
  letter-spacing: 0.04em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
`;

