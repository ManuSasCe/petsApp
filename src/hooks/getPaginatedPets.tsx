import { useState, useEffect } from "react";
import { fetchPets } from "../services/petService";
import { Pet, SortOption } from "../types";
import { toast } from "react-toastify";

interface GetPaginatedPetsResponse {
  petsData: { pets: Pet[]; totalCount: number } | null;
  isLoading: boolean;
}

export function getPaginatedPets(
  pagination: any,
  sortOption: SortOption,
): GetPaginatedPetsResponse {
  const [petsData, setPetsData] = useState<{
    pets: Pet[];
    totalCount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // just to prevent setPetsData(data) or setIsLoading(false)
    // from being executed after the component no longer exists in the DOM.
    let isActive = true;

    const loadPets = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPets({
          page: pagination.page,
          sort: sortOption.key,
          direction: sortOption.direction,
        });

        if (isActive) {
          setPetsData(data);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
          toast.error("we have an error!");

        } else {
          console.error("Fetch error:", err);
          toast.error("we have an error!");
          setPetsData(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadPets();

    return () => {
      isActive = false;
    };
  }, [pagination, sortOption]);

  return { petsData, isLoading };
}
