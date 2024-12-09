import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "@/hooks/use-session";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLocation } from "react-router";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalSignIns: number;
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
  totalSignIns,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { socket } = useSession();
  const location = useLocation();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    manualPagination: true,
    pageCount: Math.ceil(totalSignIns / pageSize),
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    table.setPageSize(newSize);
    setPageSize(newSize);

    // Optimistic update
    socket.emit("update_filters", {
      pageSize: newSize,
      type: location.pathname === "/personal" ? "personal" : "global",
    });
  };

  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
    socket.emit("update_filters", {
      pageSize: pageSize,
      from: from,
      to: to,
      type: location.pathname === "/personal" ? "personal" : "global",
    });
  };

  const handlePaginationChange = (newPageIndex: number) => {
    console.log(newPageIndex, "test123");
    setPageIndex(newPageIndex);
    socket.emit("update_filters", {
      pageIndex: newPageIndex,
      pageSize,
      from: dateRange.from,
      to: dateRange.to,
      type: location.pathname === "/personal" ? "personal" : "global",
    });
  };

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {dateRange.from.toLocaleDateString()} -{" "}
                    {dateRange.to.toLocaleDateString()}
                  </>
                ) : (
                  dateRange.from.toLocaleDateString()
                )
              ) : (
                "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              //@ts-ignore
              onSelect={(range) => {
                handleDateRangeChange(range.from, range.to);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            handlePageSizeChange(value);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            {[2, 4, 8, 10].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getRowModel().rows.length} of {initialData.length}{" "}
          results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();

              handlePaginationChange(pageIndex - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              handlePaginationChange(pageIndex + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
