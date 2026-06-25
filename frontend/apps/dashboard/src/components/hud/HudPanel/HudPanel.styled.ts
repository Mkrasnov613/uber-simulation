import styled from 'styled-components';
import { COLORS, FONT } from '../../../theme';

export const HUD_WIDTH = 280;

export const PanelContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${HUD_WIDTH}px;
  display: flex;
  flex-direction: column;
  background: ${COLORS.panel};
  border-left: 1px solid ${COLORS.panelBorder};
  font-family: ${FONT};
  z-index: 20;
  overflow: hidden;
  transform: ${p => p.$visible ? 'translateX(0)' : `translateX(${HUD_WIDTH}px)`};
  transition: transform 0.25s ease;
  pointer-events: ${p => p.$visible ? 'auto' : 'none'};
`;

export const PanelHeader = styled.div`
  padding: 52px 12px 12px;
  border-bottom: 1px solid ${COLORS.panelBorder};
  flex-shrink: 0;
`;

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PanelTitle = styled.span`
  color: ${COLORS.textPrimary};
  font-size: 13px;
  font-weight: 600;
`;

export const StatsWrapper = styled.div`
  flex-shrink: 0;
`;

export const DriverListHeader = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid ${COLORS.panelBorder};
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const DriverListLabel = styled.span`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const DriverListTitle = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 12px;
  font-weight: 600;
`;
