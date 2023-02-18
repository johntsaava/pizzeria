import { useContext } from "react";

import { PizzaContext } from "~/components/Pizza";

export function Cheese({
  position = [0, 0, 0],
  color,
  scale = [1, 1, 1],
}: {
  position?: [number, number, number];
  color?: string;
  scale?: [number, number, number];
}) {
  const { nodes, materials } = useContext(PizzaContext);

  if (!nodes || !materials) {
    throw new Error("Cheese requires nodes and materials");
  }

  return (
    <group>
      <mesh name="Cheese" position={position} scale={scale}>
        <cylinderGeometry args={[160, 160, 12, 32]} />
        <meshStandardMaterial color={color || "#f5f5f5"} />
      </mesh>
    </group>
  );
}
