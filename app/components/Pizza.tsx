import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function Pizza() {
  const gltf = useLoader(GLTFLoader, "/cheese_pizza.gltf");

  return <primitive object={gltf.scene} scale={50} />;
}
