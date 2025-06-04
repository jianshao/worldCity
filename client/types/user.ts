export interface User {
  id: number;
  name: string;
  location: string;
  avatar: string;
  age: number;
  photos: string[];
  onlineStatus: string;
  distance: number;
  // city: string;
}

export interface AddressResp {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  is_default: boolean;
}

export interface AddressListResp {
  count: number;
  addresses: AddressResp[];
}
