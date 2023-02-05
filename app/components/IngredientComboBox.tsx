import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import React from "react";

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
  selectedItems: Ingredient[];
  setSelectedItems: (items: Ingredient[]) => void;
};

export function IngredientComboBox({
  data,
  selectedItems,
  setSelectedItems,
}: IngredientComboBoxProps) {
  const [inputValue, setInputValue] = React.useState("");
  const items = React.useMemo(
    () => getFilteredIngrediets(selectedItems, inputValue, data),
    [selectedItems, inputValue, data]
  );

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems ?? []);
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
    getToggleButtonProps,
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
            setSelectedItems([...selectedItems, newSelectedItem]);
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
    <div className="relative">
      <div className="flex flex-col gap-2">
        <label className="w-fit" {...getLabelProps()}>
          Pick some ingredients:
        </label>

        {selectedItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedItems.map(function renderSelectedItem(
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
                  {selectedItemForRender.label}
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

        <div className="flex flex-grow gap-0.5">
          <input
            placeholder="Best ingredient ever"
            className="w-full border-b bg-transparent"
            {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          />
          <button
            aria-label="toggle menu"
            className="px-2"
            type="button"
            {...getToggleButtonProps()}
          >
            &#8595;
          </button>
        </div>
      </div>

      <ul
        className={`absolute left-0 right-0 mt-2 max-h-80 overflow-scroll rounded bg-white p-0 shadow-md ${
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
