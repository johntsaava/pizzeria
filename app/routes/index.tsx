import { Suspense } from "react";

import Scene from "~/components/Scene";

export default function Index() {
  return (
    <div className="flex flex-grow flex-col">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  );
}
