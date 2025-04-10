import { useState, useEffect } from "react";
import { fetchPets } from "../services/petService";
import { Pet, SortOption } from "../types";
import PaginationControls from "../components/PaginationControls";
import SortOptions from "../components/SortOptions";
import PetCard from "../components/PetCard";
import PetOfDay from "../components/PetOfDay";
import { usePetsData } from "../hooks/usePetsData";
import Layout from "../components/layout";
import { useFilterStore } from "../stores/filterStore";
import { Spinner } from "flowbite-react";

const PAGE_SIZE = 10;

interface PetsResponse {
  pets: Pet[];
  totalCount: number;
}

export default function HomePage() {
  // Component state management
  const [isLoading, setIsLoading] = useState(true);
  const [petsData, setPetsData] = useState<PetsResponse | null>(null);
  const [showPetOfDay, setShowPetOfDay] = useState(false);

  // Fetch all pets data
  const allPets = usePetsData();

  // Zustand store for filter state
  const {
    sortOption,
    pagination,
    setSortOption,
    setPagination,
    resetFilters
  } = useFilterStore();

  /**
   * Fetches pets data whenever filters or pagination changes
   * Handles loading states and error cases
   */
  useEffect(() => {
    const loadPets = async () => {
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
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, [pagination, sortOption]);

  // Event handlers
  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
    setPagination({ ...pagination, page: 1 });
  };

  const handleResetFilters = () => {
      resetFilters();
      setShowPetOfDay(false);
    
  };


  const hasActiveFilters = 
    pagination.page !== 1 ||
    sortOption.key !== 'name' ||
    sortOption.direction !== 'asc';

  return (
    <Layout>
      <div className="m-4 space-y-8">
        {/* Header and controls section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Our Pets</h1>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className={`rounded-lg px-4 py-2 ${
                showPetOfDay ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setShowPetOfDay(!showPetOfDay)}
            >
              {showPetOfDay ? "Hide Pet of the Day" : "Show Pet of the Day"}
            </button>
            
            <SortOptions
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />

            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Featured pet section */}
        {showPetOfDay && (
          <div className="mb-8">
            <PetOfDay allPets={allPets} />
          </div>
        )}

        {/* Main content section */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner color="purple" aria-label="Loading..." size="xl" />
          </div>
        ) : (
          <>
            {petsData?.pets?.length ? (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {petsData.pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>

                <PaginationControls
                  currentPage={pagination.page}
                  totalCount={petsData.totalCount}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No pets found
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}