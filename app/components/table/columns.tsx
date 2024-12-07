import { ColumnDef } from "@tanstack/react-table";

export type SignIns = {
  email: string;
  created_at: string;
};

export const columns: ColumnDef<SignIns>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Date",
  },
];
