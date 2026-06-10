import { FONT } from "../theme";

interface Props {
  children: React.ReactNode;
}

export const SimulationWindow = ({ children }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        zIndex: 50,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 760,
          background: "#0d1218",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
