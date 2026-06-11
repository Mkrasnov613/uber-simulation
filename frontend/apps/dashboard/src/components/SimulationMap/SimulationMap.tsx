import { useMemo, type MutableRefObject } from "react";
import { MapCanvas } from "../../canvas/map/MapCanvas";
import { boundsFromMap } from "../../canvas/utils/boundsFromMap";
import type { DriverEntity } from "../../canvas/entities/DriverEntity";
import type { PassengerEntity } from "../../canvas/entities/PassengerEntity";
import type { TripEntity } from "../../canvas/entities/TripEntity";
import type { RoadMap } from "../../types/map";
import { MapWrapper } from "./SimulationMap.styled";

interface Props {
  roadMap: RoadMap;
  drivers: MutableRefObject<Map<string, DriverEntity>>;
  passengers: MutableRefObject<Map<string, PassengerEntity>>;
  trips: MutableRefObject<Map<string, TripEntity>>;
  tickStart: MutableRefObject<number>;
  smooth: boolean;
}

export const SimulationMap = ({
  roadMap,
  drivers,
  passengers,
  trips,
  tickStart,
  smooth,
}: Props) => {
  const bounds = useMemo(() => boundsFromMap(roadMap), [roadMap]);

  return (
    <MapWrapper>
      <MapCanvas
        bounds={bounds}
        roadMap={roadMap}
        drivers={drivers}
        passengers={passengers}
        trips={trips}
        tickStart={tickStart}
        smooth={smooth}
      />
    </MapWrapper>
  );
};
