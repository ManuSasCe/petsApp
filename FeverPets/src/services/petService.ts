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
  
  if (params?.page) {
    queryParams.append('_page', params.page.toString());
  }
  
  if (params?.limit) {
    queryParams.append('_limit', params.limit.toString());
  } else {
    queryParams.append('_limit', '8');
  }
  
  if (params?.sort) {
    queryParams.append('_sort', `${params.sort}`);
  }

  if (params?.direction) {
    queryParams.append('_order', params.direction);
  }

  if (params?.direction) {
    queryParams.append('direction', `${params.direction}`);
  }
  
  const url = `${API_BASE_URL}/pets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pets: ${response.status}`);
  }
  
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
  const pets = await response.json();
  
  return {
    pets,
    totalCount: totalCount || pets.length
  };
}

export async function fetchPetById(id: number | string): Promise<Pet> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pet with id ${id}: ${response.status}`);
  }
  
  return response.json();
}