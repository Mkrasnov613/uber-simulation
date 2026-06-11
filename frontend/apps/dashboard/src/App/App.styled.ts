import styled from 'styled-components';
import { COLORS, FONT } from '../theme';

export const AppRoot = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: ${COLORS.bg};
  overflow: hidden;
  font-family: ${FONT};
`;
