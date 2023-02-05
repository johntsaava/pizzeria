import React from "react";

export enum LayerPlacement {
  Singular = "Singular",
  Star = "Star",
}

type SingularPlacement = {
  type: LayerPlacement.Singular;
};

type StarPlacement = {
  type: LayerPlacement.Star;
  count: number;
  radius: number;
};

type LayerProps = {
  placement: SingularPlacement | StarPlacement;
  position: [number, number, number];
  children: React.ReactElement<{
    position: [number, number, number];
  }>;
};

export function Layer({ placement, position, children }: LayerProps) {
  switch (placement.type) {
    case LayerPlacement.Star:
      return (
        <>
          {Array.from({ length: placement.count }, (_, i) => {
            const angle = (i * 2 * Math.PI) / placement.count;
            return React.cloneElement(children, {
              position: [
                position[0] + Math.cos(angle) * placement.radius,
                position[1],
                position[2] + Math.sin(angle) * placement.radius,
              ],
              key: i,
            });
          })}
        </>
      );
    case LayerPlacement.Singular:
    default:
      return React.cloneElement(children, {
        position,
      });
  }
}
