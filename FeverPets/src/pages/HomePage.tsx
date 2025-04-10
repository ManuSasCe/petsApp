import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchPets } from "../services/petService";
import { PaginationState, Pet, SortOption } from "../types";
import PaginationControls from "../components/PaginationControls";
import SortOptions from "../components/SortOptions";
import PetCard from "../components/PetCard";

const PAGE_SIZE = 8;

interface PetsResponse {
  pets: Pet[];
  totalCount: number;
}

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [sortOption, setSortOption] = useState<SortOption>({
    key: (searchParams.get("sortKey") as SortOption["key"]) || "name",
    direction:
      (searchParams.get("sortDir") as SortOption["direction"]) || "asc",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: PAGE_SIZE,
    totalItems: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [petsData, setPetsData] = useState<PetsResponse | null>(null);

  useEffect(() => {
    const getPets = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPets({
          page: pagination.page,
          sort: sortOption.key,
          direction: sortOption.direction,
          limit: pagination.pageSize,
        });

        setPetsData(data);
        setPagination((prev) => ({
          ...prev,
          totalItems: data.totalCount,
        }));
      } catch (err) {
        setError("Failed to fetch pets. Please try again later.");
        console.error("Error fetching pets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getPets();
  }, [pagination.page, pagination.pageSize, sortOption]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("sortKey", sortOption.key);
    params.set("sortDir", sortOption.direction);
    params.set("page", pagination.page.toString());

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true },
    );
  }, [sortOption, pagination.page, navigate, location.pathname, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const totalPages = Math.max(
    1,
    Math.ceil((petsData?.totalCount || 0) / pagination.pageSize),
  );

  return (
    <div className="m-4 space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold">Explore Pets</h1>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-b-2"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {petsData?.pets?.map((pet) => <PetCard key={pet.id} pet={pet} />)}
          </div>

          {!isLoading && (!petsData?.pets || petsData.pets.length === 0) && (
            <div className="p-8 text-center">
              <p className="text-lg text-gray-500">No pets found.</p>
            </div>
          )}

          {petsData?.pets && petsData.pets.length > 0 && (
            <PaginationControls
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
