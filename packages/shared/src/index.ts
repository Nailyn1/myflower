export interface Plant {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CreatePlantDTO {
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}
