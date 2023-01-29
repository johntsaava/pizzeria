import useSpline from "@splinetool/r3f-spline";

import { Bread } from "~/components/Bread";
import { Cheese } from "~/components/Cheese";
import { Tomato } from "~/components/Tomato";

export function Pizza({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/2jPSuxVUuELYf6rU/scene.splinecode"
  );

  return (
    <group {...props} dispose={null}>
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[0, 300, 0]}
        linearDamping={0.31}
        velocity={[0, -100, 0]}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[70, 300, 70]}
        linearDamping={0.3}
        velocity={[0, -100, 0]}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[-70, 300, 70]}
        linearDamping={0.29}
        velocity={[0, -100, 0]}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[70, 300, -70]}
        linearDamping={0.295}
        velocity={[0, -100, 0]}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[-70, 300, -70]}
        linearDamping={0.315}
        velocity={[0, -100, 0]}
      />
      <Cheese position={[0, 200, 0]} velocity={[0, -100, 0]} />
      <Bread nodes={nodes} materials={materials} />
    </group>
  );
}
