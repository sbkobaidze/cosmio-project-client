import { useSession } from "@/hooks/use-session";
import { Loader } from "lucide-react";
import { Outlet } from "react-router";

const Layout = () => {
  const { user, loading } = useSession();

  if (loading && !user) return <Loader className="animate-spin" />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
