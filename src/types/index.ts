export type PetKind = "cat" | "dog";
export interface BasePet {
  id: number;
  name: string;
  kind: PetKind;
  weight: number;
  height: number;
  length: number;
  photo_url: string;
  description: string;
}

export interface Cat extends BasePet {
  kind: "cat";
  number_of_lives: number;
}

export interface Dog extends BasePet {
  kind: "dog";
}

export type Pet = Cat | Dog;

export type SortKey = "weight" | "height" | "length" | "name" | "kind";

export type SortDirection = "asc" | "desc";

export type SortOption = {
  key: SortKey;
  direction: SortDirection;
};

export type HealthStatus = "unhealthy" | "healthy" | "very-healthy";

export interface PaginationState {
  page: number;
  pageSize: number;
}
