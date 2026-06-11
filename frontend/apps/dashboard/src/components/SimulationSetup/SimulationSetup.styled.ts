import styled from 'styled-components';
import { COLORS, FONT } from '../../theme';

export const SetupHeader = styled.div`
  padding: 22px 28px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SetupTitle = styled.div`
  color: ${COLORS.textPrimary};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

export const SetupSubtitle = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.14em;
`;

export const SetupBody = styled.div`
  padding: 22px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionHeading = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const FieldLabel = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

export const FieldsGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${p => p.$columns}, 1fr);
  gap: 12px;
`;

export const StyledInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  color: ${COLORS.textPrimary};
  font-size: 13px;
  font-weight: 600;
  font-family: ${FONT};
  padding: 7px 10px;
  outline: none;
  box-sizing: border-box;
`;

export const StyledSelect = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  color: ${COLORS.textPrimary};
  font-size: 13px;
  font-weight: 600;
  font-family: ${FONT};
  padding: 7px 10px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
`;

export const SetupFooter = styled.div`
  padding: 14px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ResetButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${COLORS.textSecondary};
  font-size: 11px;
  font-weight: 600;
  font-family: ${FONT};
  cursor: pointer;
  letter-spacing: 0.04em;
`;

export const StartButton = styled.button<{ $loading: boolean }>`
  padding: 8px 24px;
  border-radius: 6px;
  background: ${p => p.$loading ? 'rgba(52, 211, 153, 0.4)' : COLORS.green};
  border: none;
  color: #0a0e15;
  font-size: 12px;
  font-weight: 700;
  font-family: ${FONT};
  letter-spacing: 0.04em;
  cursor: ${p => p.$loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 7px;
`;
