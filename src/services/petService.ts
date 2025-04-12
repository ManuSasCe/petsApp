import { toast } from "react-toastify";
import { Pet } from "../types";

const API_BASE_URL = "https://my-json-server.typicode.com/Feverup/fever_pets_data";

interface FetchPetsParams {
  page?: number;
  sort?: string;
  direction?: string;
  limit?: number;
}

export interface PetsResponse {
  pets: Pet[];
  totalCount: number;
}

export async function fetchPets(params?: FetchPetsParams): Promise<PetsResponse> {
  const queryParams = new URLSearchParams();
  const limit = params?.limit || 10;

  if (params?.page) {
    queryParams.append('_page', params.page.toString());
  }

  queryParams.append('_limit', limit.toString());

  if (params?.sort) {
    queryParams.append('_sort', params.sort);
  }

  if (params?.direction) {
    queryParams.append('_order', params.direction);
  }

  const url = `${API_BASE_URL}/pets?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    toast.error("we have an error!", );
    throw new Error(`Failed to fetch pets: ${response.status}`);
  }

  const pets = await response.json();
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);

  
  return {
    pets: pets, 
    totalCount: totalCount
  };
}

export async function fetchPetById(id: number | string): Promise<Pet> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`);
  
  if (!response.ok) {
    toast.error("we have an error!", );
    throw new Error(`Failed to fetch pet with id ${id}: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchAllPets(): Promise<Pet[]> {
  const url = `${API_BASE_URL}/pets`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    toast.error("we have an error!", );
    throw new Error(`Failed to fetch all pets: ${response.status}`);
  }
  
  return response.json();
}