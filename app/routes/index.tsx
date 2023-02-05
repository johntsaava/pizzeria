import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useFieldArray, useForm } from "react-hook-form";

import { Bread } from "~/components/Bread";
import { Cheese } from "~/components/Cheese";
import { IngredientCards } from "~/components/IngredientCards";
import { IngredientComboBox } from "~/components/IngredientComboBox";
import { Layer, LayerPlacement } from "~/components/Layer";
import { Pizza } from "~/components/Pizza";
import Scene from "~/components/Scene";
import { Tomato } from "~/components/Tomato";
import type { Category, Ingredient } from "~/utils/data";
import { categories, ingredients } from "~/utils/data";

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

  return (
    <main className="container flex flex-grow flex-col gap-4 pt-4 pb-40">
      <section className="grid grid-cols-1 gap-4 md:h-[32rem] md:max-h-[32rem] md:grid-cols-3">
        <div className="h-[32rem] md:col-span-2">
          <Scene>
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
        </div>

        <IngredientCards ingredients={ingredients} />
      </section>

      <section>
        <IngredientComboBox data={data.ingredients} ingredients={ingredients} />
      </section>
    </main>
  );
}
