// stores/addressStore.ts
import { AddressResp } from "@/types/user";
import { create } from "zustand";

interface AddressState {
  selectedAddress: AddressResp;
  setSelectedAddress: (addr: AddressResp) => void;
}

const defaultAddress: AddressResp = {
  id: 0,
  user_id: 0,
  name: "",
  phone: "",
  address: "",
  is_default: false,
};
export const useAddressStore = create<AddressState>((set) => ({
  selectedAddress: defaultAddress,
  setSelectedAddress: (addr) => set({ selectedAddress: addr }),
}));
