import { usePlane } from "@react-three/cannon";
import type { Mesh } from "three";

export function Plane() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
    receiveShadow: true,
    castShadow: true,
  }));

  return <mesh ref={ref} />;
}
