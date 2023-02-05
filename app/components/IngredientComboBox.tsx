import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import React from "react";
import type { UseFieldArrayReturn } from "react-hook-form";

import type { FormValues } from "~/routes";
import type { Ingredient } from "~/utils/data";
import { hexToRgba } from "~/utils/hexToRgba";

function getIngredientsFilter(inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function ingredientsFilter(ingredient: Ingredient) {
    return (
      !inputValue ||
      ingredient.label.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}

function getFilteredIngrediets(
  selectedItems: Ingredient[],
  inputValue: string,
  ingredients: Ingredient[]
) {
  return ingredients.filter((ingredient) => {
    return (
      !selectedItems.map((item) => item.id).includes(ingredient.id) &&
      getIngredientsFilter(inputValue)(ingredient)
    );
  });
}

type IngredientComboBoxProps = {
  data: Ingredient[];
  ingredients: UseFieldArrayReturn<FormValues, "ingredients", "uuid">;
};

export function IngredientComboBox({
  data,
  ingredients,
}: IngredientComboBoxProps) {
  const [inputValue, setInputValue] = React.useState("");
  const items = React.useMemo(
    () => getFilteredIngrediets(ingredients.fields, inputValue, data),
    [ingredients.fields, inputValue, data]
  );

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems: ingredients.fields,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            ingredients.replace(newSelectedItems ?? []);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    highlightedIndex,
    selectedItem,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
  } = useCombobox({
    id: "ingredient-combobox",
    items,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    itemToString(item) {
      return item ? item.label : "";
    },
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true, highlightedIndex: 0 }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            ingredients.append(newSelectedItem);
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue ?? "");

          break;
        default:
          break;
      }
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="w-fit" {...getLabelProps()}>
          Pick some ingredients:
        </label>

        {ingredients.fields.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {ingredients.fields.map(function renderSelectedItem(
              selectedItemForRender,
              index
            ) {
              return (
                <span
                  className="rounded-full border px-2"
                  key={selectedItemForRender.id}
                  {...getSelectedItemProps({
                    selectedItem: selectedItemForRender,
                    index,
                  })}
                  style={{
                    backgroundColor: hexToRgba(
                      selectedItemForRender.color,
                      0.35
                    ),
                  }}
                >
                  {selectedItemForRender.label} ${selectedItemForRender.price}
                  <span
                    className="cursor-pointer px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItem(selectedItemForRender);
                    }}
                  >
                    &#10005;
                  </span>
                </span>
              );
            })}
          </div>
        )}

        <input
          placeholder="Best ingredient ever"
          className="border-b bg-transparent p-2"
          {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
        />
      </div>

      <ul
        className={`w-inherit absolute mt-2 max-h-36 overflow-scroll rounded bg-white p-0 shadow-md ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={clsx(
                highlightedIndex === index && "bg-opal-400",
                selectedItem === item && "font-bold",
                "flex flex-col py-2 px-3 shadow-sm"
              )}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
