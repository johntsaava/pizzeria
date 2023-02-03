import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React from "react";

export interface Props {
  dragOverlay?: boolean;
  isDragging?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  transition?: string;
  value: React.ReactNode;
}

export const Item = React.memo(
  React.forwardRef<HTMLButtonElement, Props>(
    (
      { dragOverlay, isDragging, listeners, transition, transform, value },
      ref
    ) => {
      return (
        <button
          ref={ref}
          className={clsx(
            "flex h-32 w-64 cursor-grab items-center justify-center rounded-3xl bg-white text-center",
            dragOverlay ? "cursor-grabbing shadow-xl" : "shadow"
          )}
          style={{
            transition,
            transform: CSS.Translate.toString(transform || null),
            opacity: isDragging ? 0.5 : undefined,
          }}
          {...listeners}
        >
          {value}
        </button>
      );
    }
  )
);
