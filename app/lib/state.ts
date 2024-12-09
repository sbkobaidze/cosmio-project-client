import { DateWEmail, GlobalLogins, PersonalLogins } from "types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

export const useLoginsStore = createWithEqualityFn<{
  globalLogins: GlobalLogins | null;
  personalLogins: PersonalLogins | null;
  addGlobalLogin: (login: { dates: DateWEmail }) => void;
}>(
  (set) => ({
    personalLogins: null,
    globalLogins: null,

    addGlobalLogin: (login) =>
      set((state) => ({
        globalLogins: {
          total_sign_ins: state.globalLogins?.total_sign_ins! + 1,
          dates: [...state.globalLogins?.dates!, login.dates],
        },
      })),
  }),
  shallow
);

export const useNotifications = createWithEqualityFn<{
  notifications: string[];
  addNotification: (notification: string) => void;
  showDialog: boolean;
}>(
  (set, get) => ({
    showDialog: false,

    notifications: [],
    addNotification: (notification: string) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),
  }),
  shallow
);
