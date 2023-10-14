import React, { useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { Card } from "antd";

interface MapViewProps {
  height?: number;
  defaultCenter: [number, number];
  defaultZoom: number;
  multipleCenter?: [number, number][];
  title?: string | null;
}
const MapView = ({
  height = 300,
  defaultCenter,
  multipleCenter,
  defaultZoom = 20,
  title = "Map",
}: MapViewProps) => {
  const [hue, setHue] = useState(0);
  const color = `hsl(${hue % 360}deg 39% 70%)`;

  return (
    <Card title={title}>
      <Map
        height={height}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        zoom={defaultZoom}
      >
        {multipleCenter ? (
          multipleCenter.map((center, index) => (
            <Marker
              key={index}
              width={50}
              anchor={center}
              color={color}
              onClick={() => setHue(hue + 20)}
            />
          ))
        ) : (
          <Marker
            width={50}
            anchor={defaultCenter}
            color={color}
            onClick={() => setHue(hue + 20)}
          />
        )}
      </Map>
    </Card>
  );
};

export default MapView;
