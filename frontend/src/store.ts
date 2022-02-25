import create from "zustand";

import { Channel } from "./Services/ChannelService";
import { User } from "./Services/UserService";

type State = {
  // auth state
  loggedInUser: User | null;
  setUser: (user: User | null) => void;

  // ui state
  showUserDropdown: boolean;
  toggleUserDropdown: () => void;

  // content state
  adminChannels: Channel[];
  setAdminChannels: (c: Channel[]) => void;
  memberChannels: Channel[];
  setMemberChannels: (c: Channel[]) => void;
  followingChannels: Channel[];
  setFollowingChannels: (c: Channel[]) => void;
};

export const useStore = create<State>((set) => ({
  // auth state
  loggedInUser: null,
  setUser: (u) => set(() => ({ loggedInUser: u })),

  // ui state
  showUserDropdown: false,
  toggleUserDropdown: () =>
    set((state) => ({ showUserDropdown: !state.showUserDropdown })),

  // content state
  adminChannels: [],
  setAdminChannels: (c) => set(() => ({ adminChannels: c })),
  memberChannels: [],
  setMemberChannels: (c) => set(() => ({ memberChannels: c })),
  followingChannels: [],
  setFollowingChannels: (c) => set(() => ({ followingChannels: c })),
}));
