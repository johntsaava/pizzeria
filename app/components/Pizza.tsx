import useSpline from "@splinetool/r3f-spline";
import React from "react";

import { Bread } from "~/components/Bread";
import { Cheese } from "~/components/Cheese";
import { Tomato } from "~/components/Tomato";

export const ingredients = {
  bread: {
    component: Bread,
    label: "Bread",
  },
  cheese: {
    component: Cheese,
    label: "Cheese",
  },
  tomato: {
    component: Tomato,
    label: "Tomato",
  },
};

export const PizzaContext = React.createContext<{
  nodes?: Record<string, any>;
  materials?: Record<string, any>;
}>({});

export function Pizza({ children }: { children: React.ReactNode }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/2jPSuxVUuELYf6rU/scene.splinecode"
  );

  return (
    <PizzaContext.Provider value={{ nodes, materials }}>
      <group dispose={null}>{children}</group>
    </PizzaContext.Provider>
  );
}
