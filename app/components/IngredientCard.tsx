import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React from "react";

export type IngredientCardProps = {
  dragOverlay?: boolean;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const IngredientCard = React.memo(
  React.forwardRef<HTMLButtonElement, IngredientCardProps>(
    ({ dragOverlay, listeners, style, children }, ref) => {
      return (
        <button
          ref={ref}
          className={clsx(
            "flex cursor-grab rounded border-2 p-2 font-bold",
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

type SortableIngredientCardProps = {
  id: UniqueIdentifier;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export function SortableIngredientCard({
  id,
  children,
  style,
}: SortableIngredientCardProps) {
  const { isDragging, listeners, transform, transition, setNodeRef } =
    useSortable({
      id,
    });

  return (
    <IngredientCard
      ref={setNodeRef}
      listeners={listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
        ...style,
      }}
    >
      {children}
    </IngredientCard>
  );
}
