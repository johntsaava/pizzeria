import useSpline from "@splinetool/r3f-spline";

export function Pizza({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/2jPSuxVUuELYf6rU/scene.splinecode"
  );

  return (
    <group {...props} dispose={null}>
      <mesh
        name="Bread"
        geometry={nodes.Bread.geometry}
        material={materials.bread}
        castShadow
        receiveShadow
        position={[0, 16, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        scale={1}
      />
      <mesh
        name="Tomate Sauce"
        geometry={nodes["Tomate Sauce"].geometry}
        material={materials.tomato}
        castShadow
        receiveShadow
        position={[0, 36, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        scale={1}
      />
      <mesh
        name="Cheese"
        geometry={nodes.Cheese.geometry}
        material={materials.cheese}
        castShadow
        receiveShadow
        position={[0, 41, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        scale={1}
      />
      <mesh
        name="Tomato"
        geometry={nodes.Tomato.geometry}
        material={materials.tomato}
        castShadow
        receiveShadow
        position={[0, 46, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        scale={1}
      />
      <mesh
        name="Base"
        geometry={nodes.Base.geometry}
        material={materials["Base Material"]}
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        scale={1}
      />
    </group>
  );
}
