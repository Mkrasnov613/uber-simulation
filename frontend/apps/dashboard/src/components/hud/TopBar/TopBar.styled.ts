import styled from 'styled-components';
import { COLORS, FONT } from '../../../theme';

export const TopBarRoot = styled.div`
  position: absolute;
  inset: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-family: ${FONT};
  z-index: 100;
  pointer-events: none;
`;

export const BarTitle = styled.div`
  color: ${COLORS.textPrimary};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
`;

export const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const StatusDot = styled.div<{ $live: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.$live ? COLORS.green : COLORS.red};
  box-shadow: ${p => p.$live ? `0 0 8px ${COLORS.green}99` : 'none'};
`;

export const StatusText = styled.span<{ $live: boolean }>`
  color: ${p => p.$live ? COLORS.green : COLORS.red};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

export const TimeText = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 12px;
`;
