import styled from 'styled-components';
import { COLORS, FONT } from '../../../theme';

export const ListRoot = styled.div`
  overflow-y: auto;
  flex: 1;
  font-family: ${FONT};
`;

export const DriverRow = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  border-bottom: 1px solid ${COLORS.panelDivider};
  gap: 8px;
`;

export const IndexBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.textMuted};
  font-size: 9px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const DriverInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DriverName = styled.div`
  color: ${COLORS.textPrimary};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DriverMeta = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  margin-top: 1px;
`;

export const QuotaProgress = styled.span<{ $met: boolean }>`
  color: ${p => p.$met ? COLORS.green : COLORS.textMuted};
  font-weight: ${p => p.$met ? 700 : 400};
`;

export const StatusBadge = styled.div<{ $color: string; $bg: string }>`
  padding: 2px 6px;
  border-radius: 3px;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.07em;
  flex-shrink: 0;
`;
