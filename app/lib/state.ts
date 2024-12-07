import { Logins } from "types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export const useLoginsStore = createWithEqualityFn<{
  globalLogins: Logins[];
  personalLogins: Logins | null;
  addGlobalLogin: (login: Logins[]) => void;
}>(
  (set) => ({
    personalLogins: null,
    globalLogins: [],

    addGlobalLogin: (login) =>
      set((state) => ({
        globalLogins: login,
      })),
  }),
  shallow
);

export const useNotifications = createWithEqualityFn<{
  notifications: string[];
  addNotification: (notification: string) => void;
}>(
  (set, get) => ({
    notifications: [],
    addNotification: (notification: string) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),
  }),
  shallow
);
