import { useCylinder } from "@react-three/cannon";
import { useContext } from "react";
import type { Group } from "three";

import { PizzaContext } from "~/components/Pizza";

export function Bread({
  position = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  position?: [number, number, number];
  scale?: [number, number, number];
}) {
  const { nodes, materials } = useContext(PizzaContext);
  const [ref] = useCylinder<Group>(() => ({
    position,
    args: [160, 160, 20, 32],
  }));

  if (!nodes || !materials) {
    throw new Error("Bread requires nodes and materials");
  }

  return (
    <group ref={ref}>
      <mesh
        name="Bread"
        geometry={nodes.Bread.geometry}
        material={materials.bread}
        castShadow
        receiveShadow
        rotation={[Math.PI / 2, 0, 0]}
        scale={scale}
      />
    </group>
  );
}
