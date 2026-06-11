import styled from 'styled-components';
import { FONT } from '../../theme';

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 50;
  font-family: ${FONT};
`;

export const ModalBox = styled.div`
  width: 760px;
  background: #0d1218;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
`;
