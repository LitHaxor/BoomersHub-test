export type ProviderDto = {
  id?: number;
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  type: string;
  latitude: number;
  longitude: number;
  capacity: number;
  images: string;
  phone: string;
  state?: string;
  isSaved?: boolean;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProviderGetDto = {
  count: number;
  providers: ProviderDto[];
  limit: number;
  offset: number;
};
