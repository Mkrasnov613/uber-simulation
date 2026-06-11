import styled from 'styled-components';
import { COLORS, FONT } from '../../../theme';

export const GridRoot = styled.div`
  font-family: ${FONT};
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid ${COLORS.panelDivider};
`;

export const GridCell = styled.div<{ $borderRight?: boolean }>`
  ${p => p.$borderRight && `border-right: 1px solid ${COLORS.panelDivider};`}
`;

export const CellPadding = styled.div`
  padding: 10px 12px;
`;

export const CellLabel = styled.div`
  color: ${COLORS.textMuted};
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

export const CellValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
`;

export const CellValue = styled.span`
  color: ${COLORS.textPrimary};
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
`;

export const CellUnit = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 10px;
  font-weight: 500;
`;

export const CompletedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid ${COLORS.panelDivider};
`;

export const CompletedLabel = styled.span`
  color: ${COLORS.textMuted};
  font-size: 10px;
  letter-spacing: 0.04em;
`;

export const CompletedValue = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 12px;
  font-weight: 600;
`;
