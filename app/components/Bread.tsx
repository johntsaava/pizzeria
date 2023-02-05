import { useCylinder } from "@react-three/cannon";
import { useContext } from "react";
import type { Group } from "three";

import { PizzaContext } from "~/components/Pizza";

export function Bread({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  const { nodes, materials } = useContext(PizzaContext);
  const [ref] = useCylinder<Group>(() => ({
    position,
    args: [190, 190, 30, 32],
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
        scale={1}
        position={[0, -10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
