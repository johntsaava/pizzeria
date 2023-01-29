import { Debug, Physics } from "@react-three/cannon";
import { OrbitControls, Stats } from "@react-three/drei";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Pizza } from "~/components/Pizza";

export default function Scene() {
  return (
    <Canvas
      shadows
      flat
      linear
      className="flex flex-grow flex-col [&>div]:flex [&>div]:flex-grow [&>div]:flex-col"
    >
      <Stats />
      <Physics>
        <Debug scale={1.1}>
          <OrbitControls />
          <Pizza />
          <OrthographicCamera
            name="1"
            makeDefault={true}
            zoom={1}
            far={100000}
            near={-100000}
            position={[1144.48, 433.59, 1520.06]}
            rotation={[-0.5, 0.05, 0.03]}
          />
          <hemisphereLight
            name="Default Ambient Light"
            intensity={0.75}
            color="#eaeaea"
          />
          <pointLight
            name="Point Light"
            intensity={1}
            distance={2000}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={100}
            shadow-camera-far={2500}
            position={[-97.73, 24.2, 440.34]}
          />
          <directionalLight
            name="Directional Light"
            intensity={0.7}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={-10000}
            shadow-camera-far={100000}
            shadow-camera-left={-1250}
            shadow-camera-right={1250}
            shadow-camera-top={1250}
            shadow-camera-bottom={-1250}
            position={[200, 500, 300]}
          />
        </Debug>
      </Physics>
    </Canvas>
  );
}
