import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useLoginsStore } from "@/lib/state";
import { Loader } from "lucide-react";
import { useMemo } from "react";
import { Logins } from "types";
const GlobalTable = () => {
  const { globalLogins } = useLoginsStore((state) => {
    return {
      globalLogins: state.globalLogins,
    };
  });

  const allData = useMemo(() => {
    return globalLogins.reduce<
      {
        email: string;
        created_at: string;
      }[]
    >((acc, item: Logins) => {
      const loginEntries = item.sign_in_dates.map((date) => ({
        email: item.email,
        created_at: new Date(date).toISOString(),
      }));

      return [...acc, ...loginEntries];
    }, []);
  }, [globalLogins]);

  if (!globalLogins.length) return <Loader className="animate-spin" />;

  return (
    <div className="w-screen min-h-screen   flex-col flex items-center justify-center mr-6 my-5 ">
      <h3>
        Total count:{" "}
        <span className="text-xl font-bold">
          {globalLogins.reduce((acc, item) => acc + item.sign_in_count, 0)}
        </span>{" "}
      </h3>
      <DataTable columns={columns} data={allData} />
    </div>
  );
};

export default GlobalTable;
