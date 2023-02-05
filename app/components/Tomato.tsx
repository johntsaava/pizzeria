import { useCylinder } from "@react-three/cannon";
import { useContext } from "react";
import type { Group } from "three";

import { PizzaContext } from "~/components/Pizza";

export function Tomato({
  position = [0, 0, 0],
  velocity = [0, 0, 0],
  linearDamping,
}: {
  position?: [number, number, number];
  linearDamping?: number;
  velocity?: [number, number, number];
}) {
  const { nodes, materials } = useContext(PizzaContext);
  const [ref] = useCylinder<Group>(() => ({
    mass: 10,
    args: [40, 40, 15],
    position,
    velocity,
    linearDamping,
  }));

  if (!nodes || !materials) {
    throw new Error("Tomato requires nodes and materials");
  }

  return (
    <group ref={ref}>
      <mesh
        name="Tomato"
        geometry={nodes.Tomato.geometry}
        material={materials.tomato}
        castShadow
        receiveShadow
        scale={1}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, 0]}
      />
    </group>
  );
}
