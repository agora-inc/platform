import create from "zustand";

type State = {
  loggedInUser: any;
  setUser: (user: any) => void;
};

export const useStore = create<State>((set) => ({
  loggedInUser: null,
  setUser: (u) => set(() => ({ loggedInUser: u })),
}));
