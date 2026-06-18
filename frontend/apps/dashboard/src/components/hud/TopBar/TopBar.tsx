import { useEffect, useState } from "react";
import type { WsStatus } from "../../../hooks/useSimulation";
import {
  HudToggleBtn,
  RightGroup,
  StatusDot,
  StatusGroup,
  StatusText,
  TimeText,
  TopBarRoot,
} from "./TopBar.styled";

interface Props {
  wsStatus: WsStatus;
  hudVisible?: boolean;
  onHudToggle?: () => void;
}

export const TopBar = ({ wsStatus, hudVisible, onHudToggle }: Props) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const isLive = wsStatus === "open";
  const timeStr = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <TopBarRoot>
      <RightGroup>
        <StatusGroup>
          <StatusDot $live={isLive} />
          <StatusText $live={isLive}>{isLive ? "LIVE" : "OFFLINE"}</StatusText>
        </StatusGroup>
        <TimeText>{timeStr}</TimeText>
        {onHudToggle && (
          <HudToggleBtn
            $active={!!hudVisible}
            onClick={onHudToggle}
            title={hudVisible ? "Hide HUD" : "Show HUD"}
          >
            {hudVisible ? "◨" : "◧"}
          </HudToggleBtn>
        )}
      </RightGroup>
    </TopBarRoot>
  );
};
