import { useSession } from "@/hooks/use-session";
import { useLoginsStore, useNotifications } from "@/lib/state";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { io } from "socket.io-client";
import { Logins } from "types";

export const socket = io("http://localhost:3434", {
  withCredentials: true,
  autoConnect: false,
});

const Layout = () => {
  const { user, loading } = useSession();
  const { notifications, addNotification } = useNotifications((state) => {
    return {
      notifications: state.notifications,
      addNotification: state.addNotification,
    };
  });

  useEffect(() => {
    if (user?.email && !socket.connected) {
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
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

    // return () => {
    //   socket.disconnect();
    // };
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
