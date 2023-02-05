import type { UniqueIdentifier } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React from "react";
import { createPortal } from "react-dom";
import type { UseFieldArrayReturn } from "react-hook-form";

import {
  IngredientCard,
  SortableIngredientCard,
} from "~/components/IngredientCard";
import type { FormValues } from "~/routes";
import type { Ingredient } from "~/utils/data";
import { dropAnimationConfig } from "~/utils/dropAnimationConfig";

function renderSortableIngredientCardDragOverlay({
  width,
  ingredient,
}: {
  width?: number;
  ingredient?: Ingredient;
}) {
  return (
    <IngredientCard
      dragOverlay
      style={{
        width,
      }}
    >
      {ingredient?.label}
    </IngredientCard>
  );
}

type IngredientCardsProps = {
  ingredients: UseFieldArrayReturn<FormValues, "ingredients", "uuid">;
};

export function IngredientCards({ ingredients }: IngredientCardsProps) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const isFirstAnnouncement = React.useRef(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const getIndex = (id: UniqueIdentifier) =>
    ingredients.fields.findIndex((f) => f.id === id);
  const activeIndex = activeId ? getIndex(activeId) : -1;

  React.useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        if (!active) {
          return;
        }

        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);

        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            ingredients.move(activeIndex, overIndex);
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext
        items={ingredients.fields}
        strategy={rectSortingStrategy}
      >
        <div className="flex flex-col gap-2 overflow-y-auto" ref={containerRef}>
          {ingredients.fields.map(({ id, color, label }) => {
            return (
              <SortableIngredientCard key={id} id={id}>
                {label}
              </SortableIngredientCard>
            );
          })}
        </div>
      </SortableContext>

      {typeof document !== "undefined" &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeId
              ? renderSortableIngredientCardDragOverlay({
                  width: containerRef.current?.clientWidth,
                  ingredient: ingredients.fields[activeIndex],
                })
              : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
