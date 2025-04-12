import { useState } from "react";
import { SortOption, SortDirection, SortKey } from "../types";
import { AngleDown, AngleUp } from "flowbite-react-icons/outline";
import { useTranslation } from "react-i18next";

interface SortOptionsProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function SortOptions({
  sortOption,
  onSortChange,
}: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDirection = () => {
    const newDirection: SortDirection =
      sortOption.direction === "asc" ? "desc" : "asc";
    onSortChange({ ...sortOption, direction: newDirection });
  };

  const handleSortKeyChange = (value: SortKey) => {
    onSortChange({ ...sortOption, key: value });
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          {t("order.orderBy")} {sortOption.key}
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/10 focus:outline-none">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {(
                ["name", "kind", "weight", "height", "length"] as SortKey[]
              ).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSortKeyChange(key)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={toggleDirection}
        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:bg-gray-50"
        aria-label={`Sort ${sortOption.direction === "asc" ? "ascending" : "descending"}`}
      >
        {sortOption.direction === "asc" ? (
          <AngleUp className="size-4" />
        ) : (
          <AngleDown className="size-4" />
        )}
      </button>
    </div>
  );
}
