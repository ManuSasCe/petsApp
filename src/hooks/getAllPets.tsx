import { useState, useEffect, useMemo } from "react";
import { fetchAllPets } from "../services/petService";
import { Pet } from "../types";
import { toast } from "react-toastify";

export const getAllPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const fetchedPets = await fetchAllPets();
        setPets(fetchedPets);
      } catch (error) {
        toast.error("we have an error!");
        console.error("Fetch error:", error);
      }
    };

    if (pets.length === 0) loadPets();
  }, [pets.length]);

  return useMemo(() => pets, [pets]);
};
