import { useSession } from "@/hooks/use-session";
import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router";

const Layout = () => {
  const { user, loading } = useSession();

  if (loading)
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <Loader className="animate-spin" />
      </div>
    );

  if (!user) return <Navigate to="/" />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
