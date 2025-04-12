import { useEffect } from "react";
import {
  usePetOfDay,
  usePetOfDayActions,
  useLastUpdated,
} from "../stores/petStore";
import { Pet } from "../types";

const getDailySeed = () => new Date().toISOString().split("T")[0];

export const usePetOfTheDay = (allPets: Pet[]) => {
  const currentPet = usePetOfDay();
  const lastUpdated = useLastUpdated();
  const { setPetOfDay } = usePetOfDayActions();
  const today = getDailySeed();
  //const today = "2025-16-9";

  useEffect(() => {
    if (allPets.length === 0) return;

    const shouldUpdate = !currentPet || lastUpdated !== today;

    if (shouldUpdate) {
      const seed = today
        .split("-")
        .reduce((acc, val) => acc + parseInt(val), 0);
      const randomIndex = Math.abs(seed) % allPets.length;

      setPetOfDay(allPets[randomIndex], today);
    }
  }, [allPets, today, lastUpdated, currentPet, setPetOfDay]);

  return currentPet;
};
