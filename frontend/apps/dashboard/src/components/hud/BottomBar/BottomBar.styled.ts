import styled from 'styled-components';
import { COLORS, FONT } from '../../../theme';

export const BarRoot = styled.div<{ $hudVisible: boolean; $hudWidth: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: ${p => p.$hudVisible ? p.$hudWidth : 0}px;
  font-family: ${FONT};
  z-index: 100;
  transition: right 0.25s ease;
`;

export const ControlsRow = styled.div`
  padding: 32px 14px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(0deg, rgba(8, 12, 20, 0.97) 0%, rgba(8, 12, 20, 0) 100%);
`;

export const CtrlButton = styled.button<{ $active?: boolean; $danger?: boolean }>`
  padding: 4px 10px;
  border-radius: 4px;
  background: ${p =>
    p.$danger
      ? 'rgba(239, 68, 68, 0.1)'
      : p.$active
      ? COLORS.btnActiveBg
      : COLORS.btnBg};
  border: 1px solid ${p =>
    p.$danger
      ? 'rgba(239, 68, 68, 0.3)'
      : p.$active
      ? COLORS.btnActiveBorder
      : COLORS.btnBorder};
  color: ${p =>
    p.$danger
      ? COLORS.red
      : p.$active
      ? COLORS.btnActiveText
      : COLORS.textSecondary};
  font-size: 10px;
  font-weight: 600;
  font-family: ${FONT};
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
`;

export const IconButton = styled(CtrlButton)`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 13px;
`;

export const Divider = styled.div`
  width: 1px;
  height: 16px;
  background: ${COLORS.panelBorder};
  margin: 0 2px;
`;

export const TickCounter = styled.div`
  margin-left: 8px;
  padding: 3px 9px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${COLORS.panelBorder};
  color: ${COLORS.textSecondary};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  user-select: none;
`;

export const LegendWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const LegendDot = styled.div<{ $color: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${p => p.$color};
`;

export const LegendLabel = styled.span`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.04em;
`;

export const StatusBar = styled.div`
  padding: 5px 14px;
  background: rgba(8, 12, 20, 0.97);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${COLORS.panelDivider};
`;

export const StatusBarText = styled.span`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.04em;
`;
