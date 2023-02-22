import * as RadioGroup from "@radix-ui/react-radio-group";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";

import { Pizza } from "~/components/Pizza";
import Scene from "~/components/Scene";

export type Ingredient = {
  id: number;
  label: string;
  color: string;
  price: number;
  categoryId: number;
};

export type FormValues = {
  size: string;
  baseId?: string;
};

type LoaderData = {
  defaultValues: FormValues;
  bases: Ingredient[];
  sizes: {
    value: string;
    label: string;
  }[];
};

export const loader: LoaderFunction = () => {
  const bases = [
    {
      id: 1,
      label: "Cheese & Tomato",
      color: "",
      price: 2.5,
      categoryId: 1,
    },
  ];
  const firstBase = bases[0];

  return json<LoaderData>({
    defaultValues: {
      size: "large",
      baseId: firstBase ? String(firstBase.id) : undefined,
    },
    bases,
    sizes: [
      {
        value: "small",
        label: "25",
      },
      {
        value: "medium",
        label: "30",
      },
      {
        value: "large",
        label: "35",
      },
    ],
  });
};

export default function Build() {
  const data = useLoaderData<LoaderData>();
  const form = useForm<FormValues>({
    defaultValues: data.defaultValues,
  });
  const size = form.watch("size");

  return (
    <main className="container grid flex-grow grid-cols-1 gap-6 p-0 md:grid-cols-2">
      <section>
        <div className="aspect-square">
          <Scene>
            <Pizza
              scale={size === "small" ? 0.5 : size === "medium" ? 0.75 : 1}
            />
          </Scene>
        </div>
      </section>

      <section className="p-6">
        <form>
          <h2>Size:</h2>
          <div className="h-4" />
          <Controller
            name="size"
            control={form.control}
            render={({ field }) => (
              <RadioGroup.Root
                className="flex gap-6"
                aria-label="Size"
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                {data.sizes.map(({ value, label }) => (
                  <RadioGroup.Item
                    key={value}
                    className="h-16 w-16 rounded-full border border-black outline-none hover:bg-black hover:text-white data-[state=checked]:bg-black data-[state=checked]:text-white"
                    value={value}
                    id={value}
                  >
                    <label htmlFor={value} className="pointer-events-none">
                      {label}
                    </label>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            )}
          />
          <div className="h-8" />
          <h2>Base:</h2>
          <div className="h-4" />
          <Controller
            name="baseId"
            control={form.control}
            render={({ field }) => (
              <RadioGroup.Root
                className="flex flex-wrap gap-4"
                aria-label="Base"
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                {data.bases.map(({ id, label, color }) => (
                  <RadioGroup.Item
                    key={id}
                    className="group h-12 rounded-full border px-5 outline-none hover:bg-black hover:text-white data-[state=checked]:bg-black data-[state=checked]:text-white"
                    value={String(id)}
                    id={String(id)}
                  >
                    <label htmlFor={String(id)} className="pointer-events-none">
                      {label}
                    </label>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            )}
          />
        </form>
      </section>
    </main>
  );
}
