import type { DropAnimation } from "@dnd-kit/core";
import { defaultDropAnimationSideEffects } from "@dnd-kit/core";

export const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};
