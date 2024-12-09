import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useLoginsStore } from "@/lib/state";
import { Loader } from "lucide-react";
const GlobalTable = () => {
  const { globalLogins } = useLoginsStore((state) => {
    return {
      globalLogins: state.globalLogins,
    };
  });

  if (!globalLogins?.total_sign_ins)
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="w-screen min-h-screen   flex-col flex items-center justify-center mr-6 my-5 ">
      <h3>
        Total count:{" "}
        <span className="text-xl font-bold">{globalLogins.total_sign_ins}</span>
      </h3>
      <DataTable
        totalSignIns={globalLogins.total_sign_ins}
        columns={columns}
        data={globalLogins.dates.map((item) => {
          return {
            email: item.email,
            created_at: new Date(item.date).toISOString(),
          };
        })}
      />
    </div>
  );
};

export default GlobalTable;
