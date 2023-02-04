import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React from "react";

export type LayerProps = {
  dragOverlay?: boolean;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const Layer = React.memo(
  React.forwardRef<HTMLButtonElement, LayerProps>(
    ({ dragOverlay, listeners, style, children }, ref) => {
      return (
        <button
          ref={ref}
          className={clsx(
            "flex cursor-grab rounded bg-white p-2",
            dragOverlay ? "cursor-grabbing shadow-xl" : "shadow"
          )}
          style={style}
          {...listeners}
        >
          {children}
        </button>
      );
    }
  )
);

type SortableLayerProps = {
  id: UniqueIdentifier;
  children?: React.ReactNode;
};

export function SortableLayer({ id, children }: SortableLayerProps) {
  const { isDragging, listeners, transform, transition, setNodeRef } =
    useSortable({
      id,
    });

  return (
    <Layer
      ref={setNodeRef}
      listeners={listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
    >
      {children}
    </Layer>
  );
}