import { Backdrop, ModalBox } from "./SimulationWindow.styled";

interface Props {
  children: React.ReactNode;
}

export const SimulationWindow = ({ children }: Props) => {
  return (
    <Backdrop>
      <ModalBox>{children}</ModalBox>
    </Backdrop>
  );
};
