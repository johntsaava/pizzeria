import * as RadioGroup from "@radix-ui/react-radio-group";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";

import { Pizza } from "~/components/Pizza";
import Scene from "~/components/Scene";
import type { Ingredient } from "~/utils/data";
import { ingredients } from "~/utils/data";

export type FormValues = {
  size: string;
  sauceId?: string;
};

type LoaderData = {
  defaultValues: FormValues;
  sauces: Ingredient[];
  sizes: {
    value: string;
    label: string;
  }[];
};

export const loader: LoaderFunction = () => {
  const sauces = ingredients.filter(
    (ingredient) => ingredient.categoryId === 3
  );
  const firstSauce = sauces[0];

  return json<LoaderData>({
    defaultValues: {
      size: "medium",
      sauceId: firstSauce ? String(firstSauce.id) : undefined,
    },
    sauces,
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

  return (
    <main className="container grid flex-grow grid-cols-1 gap-6 p-0 md:grid-cols-2">
      <section>
        <Scene>
          <Pizza />
        </Scene>
      </section>

      <section>
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
          <h2>Sauce:</h2>
          <div className="h-4" />
          <Controller
            name="sauceId"
            control={form.control}
            render={({ field }) => (
              <RadioGroup.Root
                className="flex flex-wrap gap-4"
                aria-label="Sauce"
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                {data.sauces.map(({ id, label, color }) => (
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
