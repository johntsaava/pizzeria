import { useCylinder } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import useSpline from "@splinetool/r3f-spline";
import type { Group } from "three";
import { TextureLoader } from "three";
import { DoubleSide } from "three";

import { useCloth } from "~/hooks/useCloth";

function Tomato({
  nodes,
  materials,
  position = [0, 0, 0],
  linearDamping,
}: {
  nodes: Record<string, any>;
  materials: Record<string, any>;
  position?: [number, number, number];
  linearDamping?: number;
}) {
  const [ref] = useCylinder<Group>(() => ({
    mass: 10,
    position,
    args: [40, 40, 15],
    velocity: [0, -100, 0],
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
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[0, 300, 0]}
        linearDamping={0.31}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[70, 300, 70]}
        linearDamping={0.3}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[-70, 300, 70]}
        linearDamping={0.29}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[70, 300, -70]}
        linearDamping={0.295}
      />
      <Tomato
        nodes={nodes}
        materials={materials}
        position={[-70, 300, -70]}
        linearDamping={0.315}
      />
      <Cheese position={[0, 200, 0]} velocity={[0, -100, 0]} />
      <Bread nodes={nodes} materials={materials} />
    </group>
  );
}
