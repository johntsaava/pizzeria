import { useCylinder } from "@react-three/cannon";
import type { Group } from "three";

export function Bread({
  nodes,
  materials,
}: {
  nodes: Record<string, any>;
  materials: Record<string, any>;
}) {
  const [ref] = useCylinder<Group>(() => ({
    position: [0, 0, 0],
    args: [190, 190, 30, 32],
  }));

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
