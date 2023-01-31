import useSpline from "@splinetool/r3f-spline";

import { Bread } from "~/components/Bread";
import { Cheese } from "~/components/Cheese";
import { Layer, LayerPlacement } from "~/components/Layer";
import { Tomato } from "~/components/Tomato";

export const ingredients = {
  bread: {
    component: Bread,
    label: "Bread",
  },
  cheese: {
    component: Cheese,
    label: "Cheese",
  },
  tomato: {
    component: Tomato,
    label: "Tomato",
  },
};

export function Pizza({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/2jPSuxVUuELYf6rU/scene.splinecode"
  );

  return (
    <group {...props} dispose={null}>
      <Layer
        position={[0, 300, 0]}
        placement={{
          type: LayerPlacement.Star,
          count: 5,
          radius: 100,
        }}
      >
        <Tomato
          nodes={nodes}
          materials={materials}
          linearDamping={0.31}
          velocity={[0, -200, 0]}
        />
      </Layer>
      <Layer
        position={[0, 200, 0]}
        placement={{
          type: LayerPlacement.Singular,
        }}
      >
        <Cheese velocity={[0, -250, 0]} />
      </Layer>
      <Layer
        position={[0, 0, 0]}
        placement={{
          type: LayerPlacement.Singular,
        }}
      >
        <Bread nodes={nodes} materials={materials} />
      </Layer>
    </group>
  );
}
