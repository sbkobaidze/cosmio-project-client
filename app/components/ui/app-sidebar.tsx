import { Bell, ChevronUp, Home, Inbox, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { useLoginsStore, useNotifications } from "@/lib/state";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { io } from "socket.io-client";
import { Logins } from "types";
import NotificationsDialog from "../notifications-dialog";

// Menu items.
const items = [
  {
    title: "Personal",
    url: "/personal",
    icon: Home,
  },
  {
    title: "Global",
    url: "/global",
    icon: Inbox,
  },
];

export const socket = io("http://localhost:3434", {
  withCredentials: true,
  autoConnect: false,
});

export function AppSidebar() {
  const { user, loading, logout } = useSession();
  const { notifications, addNotification, showDialog } = useNotifications(
    (state) => {
      return {
        notifications: state.notifications,
        addNotification: state.addNotification,
        showDialog: state.showDialog,
      };
    }
  );
  const location = useLocation();

  useEffect(() => {
    if (user?.email && !socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("users", (data: { global: Logins[]; personal: Logins }) => {
      console.log(data, "users");

      useLoginsStore.setState({
        personalLogins: data.personal,
        globalLogins: data.global,
      });
    });

    socket.on("global_update", (data: { users: Logins[] }) => {
      console.log(data, "global_update");
      useLoginsStore.setState({
        globalLogins: data.users,
      });
    });

    socket.on("notification", (data: { message: string }) => {
      addNotification(data.message);
    });
  }, [user]);

  if (location.pathname === "/") return null;

  return (
    <>
      <SidebarTrigger />

      <NotificationsDialog />
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">
              Application{" "}
              <Bell
                onClick={() => {
                  useNotifications.setState({ showDialog: true });
                }}
              />
              {notifications?.length > 0 ? (
                <div className="w-4 right-1  flex items-center justify-center h-4 bg-red-700 absolute text-white">
                  2
                </div>
              ) : null}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {user?.email}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                    }}
                  >
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
