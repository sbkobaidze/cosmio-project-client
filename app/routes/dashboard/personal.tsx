import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useLoginsStore } from "@/lib/state";
import { Loader } from "lucide-react";
const PersonalTable = () => {
  const { personalLogins } = useLoginsStore((state) => {
    return {
      personalLogins: state.personalLogins,
    };
  });

  if (!personalLogins) return <Loader className="animate-spin" />;

  return (
    <div className="w-screen min-h-screen   flex-col flex items-center justify-center mr-6 my-5 ">
      <h3>
        Total count:{" "}
        <span className="text-xl font-bold">
          {personalLogins?.sign_in_count}
        </span>{" "}
      </h3>
      <DataTable
        columns={columns}
        data={personalLogins?.sign_in_dates.map((item) => {
          console.log(item);
          return {
            email: personalLogins.email,
            created_at: new Date(item).toISOString(),
          };
        })}
      />
    </div>
  );
};

export default PersonalTable;
