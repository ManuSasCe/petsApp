interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount === 0) return null;

  return (
    <div className="my-6 flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">
        Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> -{' '}
        <span className="font-semibold">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> pets
      </span>

      <nav aria-label="Page navigation">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="ms-0 flex h-9 items-center justify-center rounded-s-lg border border-gray-300 bg-white px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`flex h-9 items-center justify-center border px-3 ${
                  currentPage === page
                    ? 'border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
              Next
            </button>
          </li>
        </ul>
      </nav>

      {currentPage === totalPages && totalPages > 1 && (
        <span className="mt-2 text-xs text-gray-500">(You have reached the last page)</span>
      )}
    </div>
  );
}