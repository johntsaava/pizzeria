import { Debug, Physics } from "@react-three/cannon";
import { OrbitControls, Stats } from "@react-three/drei";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Plane } from "~/components/Plane";

type SceneProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function Scene({ className, children }: SceneProps) {
  return (
    <Canvas shadows flat linear className={className}>
      <Stats />
      <Physics isPaused={false}>
        <Debug scale={1.1}>
          <OrbitControls />
          <OrthographicCamera
            name="1"
            makeDefault={true}
            zoom={1}
            far={100000}
            near={-100000}
            position={[500, 250, 0]}
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
          {children}
          <Plane />
        </Debug>
      </Physics>
    </Canvas>
  );
}
