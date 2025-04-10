import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPets } from "../services/petService";
import { PaginationState, Pet, SortOption } from "../types";
import PaginationControls from "../components/PaginationControls";
import SortOptions from "../components/SortOptions";
import PetCard from "../components/PetCard";
import PetOfDay from "../components/PetOfDay";
import { usePetsData } from "../hooks/usePetsData";
import Layout from "../components/layout";

const PAGE_SIZE = 10;

interface PetsResponse {
  pets: Pet[];
  totalCount: number;
}

export default function HomePage() {
  const [searchParams] = useSearchParams();

  const [sortOption, setSortOption] = useState<SortOption>({
    key: (searchParams.get("sortKey") as SortOption["key"]) || "name",
    direction:
      (searchParams.get("sortDir") as SortOption["direction"]) || "asc",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: PAGE_SIZE,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [petsData, setPetsData] = useState<PetsResponse | null>(null);
  const [showPetOfDay, setShowPetOfDay] = useState<boolean>(
    searchParams.get("showPetOfDay") === "true",
  );

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
      } catch (err) {
        setError("Failed to fetch pets. Please try again later.");
        console.error("Error fetching pets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getPets();
  }, [pagination.page, pagination.pageSize, sortOption]);

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

  const allPets = usePetsData();

  return (
    <Layout>
      <div className="m-4 space-y-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-2xl font-bold">Explore ours Pets</h1>
        </div>

        {error && (
          <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className={`rounded-lg px-4 py-2 ${showPetOfDay ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setShowPetOfDay(!showPetOfDay)}
          >
            {showPetOfDay ? "Hide Pet of the Day" : "Show Pet of the Day"}
          </button>
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>

        {showPetOfDay && (
          <div className="mb-8">
            <PetOfDay allPets={allPets} />
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-10 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
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
                totalCount={petsData?.totalCount || 0}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
