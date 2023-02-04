import type { DropAnimation, UniqueIdentifier } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { LinksFunction } from "@remix-run/node";
import React from "react";
import { createPortal } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import "swiper/element";
import { Swiper, SwiperSlide } from "swiper/react";

import { ingredients } from "~/components/Pizza";
import Scene from "~/components/Scene";
import { Layer, SortableLayer } from "~/components/SortableLayer";
import swiperStyles from "~/styles/swiper.min.css";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: swiperStyles }];
};

type FormValues = {
  layers: {
    type?: keyof typeof ingredients;
  }[];
};

export default function Index() {
  const form = useForm<FormValues>({
    defaultValues: {
      layers: [{ type: "bread" }, { type: "cheese" }],
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
    <main className="flex flex-grow flex-col gap-8 overflow-hidden py-8">
      <section className="container grid flex-grow grid-cols-2">
        <Scene />

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
              className="flex flex-col-reverse justify-center gap-2"
              ref={containerRef}
            >
              {layers.fields.map(({ id, type }) => (
                <SortableLayer key={id} id={id}>
                  {type}
                </SortableLayer>
              ))}
            </div>
          </SortableContext>

          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeId ? (
                  <Layer
                    dragOverlay
                    style={{
                      width: containerRef.current?.clientWidth,
                    }}
                  >
                    {layers.fields[activeIndex].type}
                  </Layer>
                ) : null}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </section>

      <section className="flex flex-col items-center">
        <Swiper
          slidesPerView="auto"
          style={{
            overflow: "visible",
          }}
        >
          {Object.entries(ingredients).map(([type, ingredient]) => (
            <SwiperSlide
              key={type}
              style={{
                width: "auto",
                height: "auto",
              }}
              className="mr-4 first-of-type:ml-8 last-of-type:mr-8"
            >
              <button
                onClick={() => {
                  layers.append({ type: "tomato" });
                }}
                className="flex items-center justify-center rounded-full border px-3 py-1 shadow disabled:opacity-50"
                disabled={layers.fields.some((field) => field.type === type)}
              >
                {ingredient.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </main>
  );
}
