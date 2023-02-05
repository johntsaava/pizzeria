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
import React from "react";
import { createPortal } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";

import { Bread } from "~/components/Bread";
import { Cheese } from "~/components/Cheese";
import {
  IngredientCard,
  SortableIngredientCard,
} from "~/components/IngredientCard";
import { IngredientComboBox } from "~/components/IngredientComboBox";
import { Layer, LayerPlacement } from "~/components/Layer";
import { Pizza } from "~/components/Pizza";
import Scene from "~/components/Scene";
import { Tomato } from "~/components/Tomato";
import type { Category, Ingredient } from "~/utils/data";
import { categories, ingredients } from "~/utils/data";
import { dropAnimationConfig } from "~/utils/dropAnimationConfig";

export type FormValues = {
  ingredients: Ingredient[];
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
  const data = useLoaderData<LoaderData>();
  const form = useForm<FormValues>({
    defaultValues: {
      ingredients: [],
    },
  });
  const ingredients = useFieldArray({
    control: form.control,
    name: "ingredients",
    keyName: "uuid",
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
    ingredients.fields.findIndex((f) => f.id === id);
  const activeIndex = activeId ? getIndex(activeId) : -1;

  React.useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <main className="container grid flex-grow grid-cols-1 md:grid-cols-2">
      <Scene className="m-auto max-w-md">
        <Pizza>
          <Layer
            position={[0, 0, 0]}
            placement={{
              type: LayerPlacement.Singular,
            }}
          >
            <Bread />
          </Layer>
          {ingredients.fields.map(({ id, categoryId, color }, i) => {
            if (categoryId === 3) {
              return (
                <Layer
                  key={id}
                  position={[0, (i + 1) * 50, 0]}
                  placement={{
                    type: LayerPlacement.Singular,
                  }}
                >
                  <Cheese velocity={[0, -10, 0]} color={color} />
                </Layer>
              );
            }

            return (
              <Layer
                key={id}
                position={[0, (i + 1) * 50, 0]}
                placement={{
                  type: LayerPlacement.Star,
                  count: 5,
                  radius: 100,
                }}
              >
                <Tomato linearDamping={0.31} velocity={[0, -200, 0]} />
              </Layer>
            );
          })}
        </Pizza>
      </Scene>

      <section className="flex flex-col gap-4">
        <IngredientComboBox
          data={data.ingredients}
          selectedItems={ingredients.fields}
          setSelectedItems={(items) => {
            ingredients.replace(items);
          }}
        />

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
            <div
              className="flex flex-col justify-center gap-2 transition-all duration-300 ease-in-out"
              ref={containerRef}
            >
              {ingredients.fields.map(({ id, color, label }) => {
                return (
                  <SortableIngredientCard
                    key={id}
                    id={id}
                    style={{
                      backgroundColor: color,
                    }}
                  >
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
      </section>
    </main>
  );
}

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
        backgroundColor: ingredient?.color,
      }}
    >
      {ingredient?.label}
    </IngredientCard>
  );
}
