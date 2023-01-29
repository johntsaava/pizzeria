import { useCylinder } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import useSpline from "@splinetool/r3f-spline";
import type { Group } from "three";
import { TextureLoader } from "three";
import { DoubleSide } from "three";

import { useCloth } from "~/hooks/useCloth";

function Cheese({
  size = 340,
  divisions = 10,
  position = [0, 0, 0],
  velocity = [0, 0, 0],
}: {
  size?: number;
  divisions?: number;
  position?: [number, number, number];
  velocity?: [number, number, number];
}) {
  const ref = useCloth({
    Nx: divisions,
    Ny: divisions,
    mass: 0.1,
    clothSize: size,
    position,
    velocity,
  });
  const map = useLoader(TextureLoader, "/textures/cheese.png");

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, divisions, divisions]} />
      <meshPhongMaterial side={DoubleSide} map={map} transparent />
    </mesh>
  );
}

function Bread({
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

export function Pizza({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/2jPSuxVUuELYf6rU/scene.splinecode"
  );

  return (
    <group {...props} dispose={null}>
      <Cheese position={[0, 200, 0]} velocity={[0, -100, 0]} />
      <Bread nodes={nodes} materials={materials} />
    </group>
  );
}
