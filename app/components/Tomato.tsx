import { useCylinder } from "@react-three/cannon";
import type { Group } from "three";

export function Tomato({
  nodes,
  materials,
  position = [0, 0, 0],
  velocity = [0, 0, 0],
  linearDamping,
}: {
  nodes: Record<string, any>;
  materials: Record<string, any>;
  position?: [number, number, number];
  linearDamping?: number;
  velocity?: [number, number, number];
}) {
  const [ref] = useCylinder<Group>(() => ({
    mass: 10,
    args: [40, 40, 15],
    position,
    velocity,
    linearDamping,
  }));

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
