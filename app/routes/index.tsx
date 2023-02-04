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
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";

import Scene from "~/components/Scene";
import { Layer, SortableLayer } from "~/components/SortableLayer";
import type { Category, Ingredient } from "~/utils/data";
import { categories, ingredients } from "~/utils/data";
import { dropAnimationConfig } from "~/utils/dropAnimationConfig";

type FormValues = {
  layers: {
    ingredientId: number;
  }[];
};

type LoaderData = {
  categories: Category[];
  ingredients: Ingredient[];
};

export const loader: LoaderFunction = () => {
  return json<LoaderData>({
    categories,
    ingredients,
  });
};

export default function Index() {
  const { categories, ingredients } = useLoaderData<LoaderData>();
  const form = useForm<FormValues>({
    defaultValues: {
      layers: [],
    },
  });
  const layers = useFieldArray({
    control: form.control,
    name: "layers",
  });
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
    layers.fields.findIndex((f) => f.id === id);
  const activeIndex = activeId ? getIndex(activeId) : -1;

  React.useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <main className="flex flex-grow flex-col gap-8 py-8">
      <section className="container grid flex-grow grid-cols-1 md:grid-cols-2">
        <Scene className="m-auto max-w-md" />

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
                layers.move(activeIndex, overIndex);
              }
            }
          }}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext items={layers.fields} strategy={rectSortingStrategy}>
            <div
              className="flex flex-col-reverse justify-center gap-2 transition-all duration-300 ease-in-out"
              ref={containerRef}
            >
              {layers.fields.map(({ id, ingredientId }) => {
                const ingredient = ingredients.find(
                  (ingredient) => ingredientId === ingredient.id
                );

                if (!ingredient) return null;

                return (
                  <SortableLayer
                    key={id}
                    id={id}
                    style={{
                      backgroundColor: ingredient.color,
                    }}
                  >
                    {ingredient.label}
                  </SortableLayer>
                );
              })}
            </div>
          </SortableContext>

          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeId
                  ? renderSortableLayerDragOverlay({
                      width: containerRef.current?.clientWidth,
                      ingredient: ingredients.find(
                        (ingredient) =>
                          ingredient.id ===
                          layers.fields[activeIndex].ingredientId
                      ),
                    })
                  : null}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </section>

      <section className="container flex flex-col gap-8">
        {categories.map((category, i) => (
          <div
            key={category.id}
            className="flex flex-wrap justify-center gap-1"
          >
            {ingredients
              .filter((ingredient) => ingredient.categoryId === category.id)
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((ingredient) => {
                const index = layers.fields.findIndex(
                  (field) => field.ingredientId === ingredient.id
                );
                const isActive = index !== -1;
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => {
                      if (isActive) {
                        layers.remove(index);
                      } else {
                        layers.append({
                          ingredientId: ingredient.id,
                        });
                      }
                    }}
                    className={clsx(
                      "flex items-center justify-center rounded-full border-2 px-3 py-1 font-bold text-purple-800",
                      isActive ? "" : "border-transparent"
                    )}
                    style={{
                      backgroundColor: hexToRgba(
                        ingredient.color,
                        isActive ? 0.7 : 0.35
                      ),
                    }}
                  >
                    {ingredient.label}
                  </button>
                );
              })}
          </div>
        ))}
      </section>
    </main>
  );
}

function renderSortableLayerDragOverlay({
  width,
  ingredient,
}: {
  width?: number;
  ingredient?: Ingredient;
}) {
  return (
    <Layer
      dragOverlay
      style={{
        width,
        backgroundColor: ingredient?.color,
      }}
    >
      {ingredient?.label}
    </Layer>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
