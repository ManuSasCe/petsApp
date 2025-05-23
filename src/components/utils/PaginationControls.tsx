import { useTranslation } from "react-i18next";
import { PAGE_SIZE } from "../../constants";

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalCount,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const { t } = useTranslation();

  if (totalCount === 0) return null;

  return (
    <div className="my-6 flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">
        {t("pagination.showing")}{" "}
        <span className="font-semibold">
          {(currentPage - 1) * PAGE_SIZE + 1}
        </span>{" "}
        -{" "}
        <span className="font-semibold">
          {Math.min(currentPage * PAGE_SIZE, totalCount)}
        </span>{" "}
        {t("pagination.of")} <span className="font-semibold">{totalCount}</span>{" "}
        {t("pagination.pets")}
      </span>

      <nav aria-label="Page navigation">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="ms-0 flex h-9 items-center justify-center rounded-s-lg border border-gray-300 bg-white px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              {t("pagination.previous")}
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`flex h-9 items-center justify-center border px-3 ${
                  currentPage === page
                    ? "border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex h-9 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              {t("pagination.next")}
            </button>
          </li>
        </ul>
      </nav>

      {currentPage === totalPages && totalPages > 1 && (
        <span className="mt-2 text-xs text-gray-500">
          {t("pagination.last_page")}
        </span>
      )}
    </div>
  );
}
