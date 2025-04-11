
export interface Pet {
    id: number;
    name: string;
    kind: string;
    weight: number;
    height: number;
    length: number;
    photo_url: string;
    description: string;
    number_of_lives?: number; // only for cats
  }
  
  export type SortKey = 'weight' | 'height' | 'length' | 'name' | 'kind';
  
  export type SortDirection = 'asc' | 'desc';
  
  export type SortOption = {
    key: SortKey;
    direction: SortDirection;
  };
  
  export type HealthStatus = 'unhealthy' | 'healthy' | 'very-healthy';
  
  export interface PaginationState {
    page: number;
    pageSize: number;
  }
  