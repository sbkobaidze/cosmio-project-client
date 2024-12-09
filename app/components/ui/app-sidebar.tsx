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
import { Link } from "react-router-dom";

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
import { DateWEmail, GlobalLogins, PersonalLogins } from "types";
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

export function AppSidebar() {
  const { user, loading, logout, socket } = useSession();
  const { notifications, addNotification, showDialog } = useNotifications(
    (state) => {
      return {
        notifications: state.notifications,
        addNotification: state.addNotification,
        showDialog: state.showDialog,
      };
    }
  );

  const { addGlobalLogin } = useLoginsStore((state) => {
    return {
      addGlobalLogin: state.addGlobalLogin,
    };
  });

  const location = useLocation();

  useEffect(() => {
    if (user?.email && !socket.connected) {
      socket.connect();
    }
  }, [user?.email, loading]);

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on(
      "users",
      (data: { global: GlobalLogins; personal: PersonalLogins }) => {
        useLoginsStore.setState({
          personalLogins: data.personal,
          globalLogins: data.global,
        });
      }
    );

    socket.on("global_update", (data: GlobalLogins) => {
      console.log(data, "global_update", "hello");
      useLoginsStore.setState({
        globalLogins: data,
      });
    });

    socket.on("increment_global", (data: DateWEmail) => {
      addGlobalLogin({
        dates: data,
      });
    });

    socket.on("personal_update", (data: { dates: { date: string }[] }) => {
      console.log(data);
      useLoginsStore.setState((state) => {
        return {
          personalLogins: {
            dates: data.dates,
            total_sign_ins: state.personalLogins?.total_sign_ins!,
          },
        };
      });
    });

    socket.on("notification", (data: { message: string }) => {
      addNotification(data.message);
    });

    return () => {
      socket.removeListener("users");
      socket.removeListener("global_update");
      socket.removeListener("notification");
      socket.removeListener("increment_global");
      socket.removeListener("personal_update");
    };
  }, []);

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
                  {notifications.length}
                </div>
              ) : null}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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
