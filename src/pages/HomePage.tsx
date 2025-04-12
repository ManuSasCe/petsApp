import { useState } from "react";
import { SortOption } from "../types";
import PaginationControls from "../components/utils/PaginationControls";
import PetCard from "../components/PetCard";
import PetOfDay from "../components/PetOfDay";
import { getAllPets } from "../hooks/getAllPets";
import Layout from "../components/Layout";
import { useFilterActions, useFilterStore } from "../stores/filterStore";
import { Button, Spinner } from "flowbite-react";
import { useTranslation } from "react-i18next";
import SortOptions from "../components/utils/SortOptions";
import { getPaginatedPets } from "../hooks/getPaginatedPets";
import { Star } from "flowbite-react-icons/outline";

export default function HomePage() {
  // Component state management

  const [showPetOfDay, setShowPetOfDay] = useState(false);
  const { t } = useTranslation();

  // Fetch all pets data
  const allPets = getAllPets();

  // Zustand store for filter state
  const { sortOption, pagination } = useFilterStore();

  const { setSortOption, setPagination, resetFilters } = useFilterActions();

  /**
   * Fetches pets data whenever filters or pagination changes
   * Handles loading states and error cases
   */
  const { petsData, isLoading } = getPaginatedPets(pagination, sortOption);

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
    sortOption.key !== "name" ||
    sortOption.direction !== "asc";

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header and controls section */}
        <div className="flex flex-col relative gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold dark:text-gray-400">
            {t("titles.our_pets")}
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              pill
              color={`${
                showPetOfDay ? "green" : "blue"
              }`}
              onClick={() => setShowPetOfDay(!showPetOfDay)}
            ><Star className="mr-2 h-5 w-5" />
              {showPetOfDay
                ? t("buttons.hide_pet_of_day")
                : t("buttons.show_pet_of_day")}
            </Button>

            <SortOptions
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
              >
                {t("buttons.reset_filters")}
              </button>
            )}
          </div>
        </div>

        {/* Featured pet section */}
        {showPetOfDay && (
            <PetOfDay allPets={allPets} />
        )}

        {/* Main content section */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner
              color="purple"
              aria-label={t("messages.loading")}
              size="xl"
            />
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
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p className="py-8 text-center text-gray-500">
                {t("messages.no_pets_found")}
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
