import { useLoader } from "@react-three/fiber";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export function Pizza() {
  const materials = useLoader(
    MTLLoader,
    "/pizza/cheese_tomato/cheese_tomato.mtl"
  );
  const object = useLoader(OBJLoader, "/pizza/pizza.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return <primitive object={object} scale={50} />;
}
