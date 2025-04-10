import { useState, useEffect, useMemo } from 'react';
import { fetchAllPets } from '../services/petService';
import { Pet } from '../types';

export const usePetsData = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const fetchedPets = await fetchAllPets();
        setPets(fetchedPets);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    
    if (pets.length === 0) loadPets();
  }, [pets.length]);

  return useMemo(() => pets, [pets]);
};