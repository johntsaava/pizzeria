import type { LinksFunction } from "@remix-run/node";
import clsx from "clsx";
import { Suspense } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "swiper/element";
import { Swiper, SwiperSlide } from "swiper/react";

import { MultipleContainers } from "~/components/MultipleContainers";
import { ingredients } from "~/components/Pizza";
import Scene from "~/components/Scene";
import swiperStyles from "~/styles/swiper.min.css";

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
      layers: [],
    },
  });
  const layers = useFieldArray({
    control: form.control,
    name: "layers",
  });

  return (
    <main className="flex flex-grow flex-col gap-8 overflow-hidden py-8">
      <section className="container grid flex-grow grid-cols-2">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        <form
          onSubmit={form.handleSubmit(console.log)}
          className={clsx(
            "flex flex-col gap-4",
            layers.fields.length === 0 ? "justify-center" : "justify-end"
          )}
        >
          <button
            type="button"
            onClick={() => {
              layers.insert(0, {});
            }}
            className="self-center rounded bg-opal-400 px-4 py-2 font-bold shadow"
          >
            Add Layer
          </button>

          {layers.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex rounded bg-white px-4 py-2 shadow"
            >
              <label htmlFor={`layers.${index}.type`}>Type</label>
              <select
                {...form.register(`layers.${index}.type` as const)}
                defaultValue={field.type}
              >
                <option value="">Select a type</option>
                {Object.entries(ingredients).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  layers.remove(index);
                }}
                className="ml-auto"
              >
                Remove
              </button>
            </div>
          ))}
        </form>
      </section>

      <section>
        <Swiper
          slidesPerView="auto"
          style={{
            overflow: "visible",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <SwiperSlide
              key={i}
              style={{
                width: "auto",
                height: "auto",
              }}
              className="mr-4 first-of-type:ml-8 last-of-type:mr-8"
            >
              <div className="flex h-32 w-64 items-center justify-center rounded-3xl bg-white text-center shadow">
                <span>Slide {i}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section>
        <MultipleContainers />
      </section>
    </main>
  );
}
