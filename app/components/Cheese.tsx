// import { useLoader } from "@react-three/fiber";
import {
  DoubleSide, //  TextureLoader
} from "three";

import { useCloth } from "~/hooks/useCloth";

export function Cheese({
  size = 340,
  divisions = 4,
  position = [0, 0, 0],
  velocity = [0, 0, 0],
  color = "yellow",
}: {
  size?: number;
  divisions?: number;
  position?: [number, number, number];
  velocity?: [number, number, number];
  color?: string;
}) {
  const ref = useCloth({
    Nx: divisions,
    Ny: divisions,
    mass: 0.1,
    clothSize: size,
    position,
    velocity,
  });
  // const map = useLoader(TextureLoader, "/textures/cheese.png");

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, divisions, divisions]} />
      {/* <meshPhongMaterial side={DoubleSide} map={map} transparent /> */}
      <meshPhongMaterial side={DoubleSide} color={color} transparent />
    </mesh>
  );
}
