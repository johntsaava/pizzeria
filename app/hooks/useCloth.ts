/* eslint-disable react-hooks/rules-of-hooks */
import type { Api } from "@react-three/cannon";
import { useSphere } from "@react-three/cannon";
import { useDistanceConstraint } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { BufferGeometry, Material, Mesh } from "three";

export function useCloth({
  Nx,
  Ny,
  mass,
  clothSize,
  position,
  velocity,
}: {
  Nx: number;
  Ny: number;
  mass: number;
  clothSize: number;
  position: [number, number, number];
  velocity: [number, number, number];
}) {
  const dist = clothSize / Nx;
  const ref = useRef<Mesh>(null);
  const particles = useRef<
    Api<Mesh<BufferGeometry, Material | Material[]>>[][]
  >([]);

  for (let i = 0; i < Nx + 1; i++) {
    particles.current.push([]);
    for (let j = 0; j < Ny + 1; j++) {
      particles.current[i].push(
        useSphere<Mesh>(() => ({
          mass,
          position: [
            position[0] + (i - Nx * 0.5) * dist,
            position[1],
            position[2] + (j - Ny * 0.5) * dist,
          ],
          velocity,
          linearDamping: 0.3,
          angularDamping: 0.3,
          args: [10],
        }))
      );
    }
  }

  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      if (i < Nx) {
        useDistanceConstraint(
          particles.current[i][j][0],
          particles.current[i + 1][j][0],
          {
            distance: dist,
          }
        );
      }
      if (j < Ny) {
        useDistanceConstraint(
          particles.current[i][j][0],
          particles.current[i][j + 1][0],
          {
            distance: dist,
          }
        );
      }
    }
  }

  useEffect(() => {
    const subscriptions: (() => void)[] = [];

    if (particles.current) {
      for (let i = 0; i < Nx + 1; i++) {
        for (let j = 0; j < Ny + 1; j++) {
          subscriptions.push(
            particles.current[i][Ny - j][1].position.subscribe((pos) => {
              const particle = particles.current[i][Ny - j][0];

              if (particle.current) {
                particle.current.position.set(...pos);
              }
            })
          );
        }
      }
    }

    return () => {
      subscriptions.forEach((sub) => sub());
    };
  }, [Nx, Ny]);

  useFrame(() => {
    if (ref.current) {
      for (let i = 0; i < Nx + 1; i++) {
        for (let j = 0; j < Ny + 1; j++) {
          const index = j * (Nx + 1) + i;

          const positionAttribute = ref.current.geometry.attributes.position;
          const particle = particles.current[i][Ny - j][0];

          if (particle.current) {
            const position = particle.current.position;

            positionAttribute.setXYZ(index, position.x, position.y, position.z);

            positionAttribute.needsUpdate = true;
            ref.current.geometry.computeVertexNormals();
          }
        }
      }
    }
  });

  return ref;
}
