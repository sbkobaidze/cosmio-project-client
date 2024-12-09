import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useSession } from "@/hooks/use-session";
import { useLoginsStore } from "@/lib/state";
import { Loader } from "lucide-react";
const PersonalTable = () => {
  const { personalLogins } = useLoginsStore((state) => {
    return {
      personalLogins: state.personalLogins,
    };
  });
  const { user } = useSession();

  if (!personalLogins)
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="w-screen min-h-screen   flex-col flex items-center justify-center mr-6 my-5 ">
      <h3>
        Total count:{" "}
        <span className="text-xl font-bold">
          {personalLogins?.total_sign_ins}
        </span>{" "}
      </h3>
      <DataTable
        totalSignIns={personalLogins?.total_sign_ins}
        columns={columns}
        data={personalLogins?.dates.map((item) => {
          return {
            email: user?.email!,
            created_at: new Date(item.date).toISOString(),
          };
        })}
      />
    </div>
  );
};

export default PersonalTable;
