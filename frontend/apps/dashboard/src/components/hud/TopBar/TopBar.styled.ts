import styled from 'styled-components';
import { COLORS, FONT } from '../../../theme';

export const TopBarRoot = styled.div`
  position: absolute;
  inset: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  font-family: ${FONT};
  z-index: 100;
  pointer-events: none;
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

export const HudToggleBtn = styled.button<{ $active: boolean }>`
  pointer-events: auto;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 4px;
  background: ${p => p.$active ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${p => p.$active ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
  color: ${p => p.$active ? COLORS.textPrimary : COLORS.textMuted};
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  font-family: ${FONT};
  line-height: 1;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.35);
  }
`;
