import React, { useEffect, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  IconColumns,
  IconUsersPlus,
  IconUserUp,
  IconFileTypeCsv,
  IconDownload,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CSVLink } from "react-csv";
import axios from "axios";
import { parseISO, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import TelevisionCreation from "./tv-creation";
import { AdvancedFilters } from "./advance-filter";
import { Popover, PopoverContent } from "@radix-ui/react-popover";
import { PopoverTrigger } from "@/components/ui/popover";

export type Voucher = {
  voucherId: number;
  serialNumber: string;
  referenceNumber: string;
  productCode: string;
  amount: number;
  discount: number;
  status: string;
  expiryDate: string;
  usedDate: string;
  createdAt: string;
  updatedAt: string;
  usedMerchant: string;
};

interface Props {
  setViewVoucher: any;
}

export default function TelevisionTable({ setViewVoucher }: Props) {
  const [voucherData, setVoucherData] = useState<any>([]);
  const [currentVoucherId, setCurrentVoucherId] = useState<number>(0);
  const [ifEditing, setIfEditing] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<any>({});

  const [data, setData] = useState<Voucher[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/tv-vouchers`)
      .then((response) => {
        setData(response.data);
        setVoucherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const fuzzyFilter = (row: any, columnId: any, value: any) => {
    const itemValue = row.getValue(columnId);
    return (
      typeof itemValue === "string" &&
      itemValue.toLowerCase().includes(value.toLowerCase())
    );
  };

  console.log(voucherData);

  const filteredData = React.useMemo(() => {
    return data.filter((item: any) => {
      if (globalFilter) {
        const searchableFields = [
          "card_number",
          "product_name",
          "voucher_code",
        ];
        return searchableFields.some((field) =>
          String(item[field]).toLowerCase().includes(globalFilter.toLowerCase())
        );
      }

      if (Object.keys(advancedFilters).length) {
        return (
          (!advancedFilters.cardNumber ||
            item.card_number.includes(advancedFilters.cardNumber)) &&
          (!advancedFilters.productName ||
            item.product_name
              .toLowerCase()
              .includes(advancedFilters.productName.toLowerCase())) &&
          (!advancedFilters.amountRange ||
            (item.amount >= advancedFilters.amountRange[0] &&
              item.amount <= advancedFilters.amountRange[1])) &&
          (!advancedFilters.status || item.status === advancedFilters.status) &&
          (!advancedFilters.dateRange?.from ||
            new Date(item.created_at) >=
              new Date(advancedFilters.dateRange.from)) &&
          (!advancedFilters.dateRange?.to ||
            new Date(item.created_at) <= new Date(advancedFilters.dateRange.to))
        );
      }

      return true;
    });
  }, [data, globalFilter, advancedFilters]);

  const handleRowClick = (voucher: any, rowId: number) => {
    setViewVoucher(voucher);
    setCurrentVoucherId(rowId);
    setIfEditing(false);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection] = useState({});
  const applyAdvancedFilters = (filters: any) => {
    setAdvancedFilters(filters);
  };

  const handleEdit = () => {
    setIfEditing(!ifEditing);
  };

  const columns: ColumnDef<Voucher>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tv_voucher_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Voucher Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("tv_voucher_id")}</div>
      ),
    },
    {
      accessorKey: "card_number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Card Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("card_number")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Product Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("product_name")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">₱{row.getValue("amount")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "discount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Discount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("discount")}%</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "voucher_code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Voucher Code
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("voucher_code")}</div>
      ),
    },
    // {
    //   accessorKey: "firstGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         1st Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
    //       {row.getValue("firstGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "secondGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         2nd Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
    //       {row.getValue("secondGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "thirdGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         3rd Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
    //       {row.getValue("thirdGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "fourthGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         4th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
    //       {row.getValue("fourthGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "fifthGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         5th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded">
    //       {row.getValue("fifthGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "sixthGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         6th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
    //       {row.getValue("sixthGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "seventhGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         7th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-pink-100 text-pink-800 px-2 py-1 rounded">
    //       {row.getValue("seventhGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "eighthGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         8th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
    //       {row.getValue("eighthGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "ninthGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         9th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded">
    //       {row.getValue("ninthGen")}%
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: "tenthGen",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         className="font-medium"
    //       >
    //         10th Gen
    //         <CaretSortIcon className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },

    //   cell: ({ row }) => (
    //     <div className="font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded">
    //       {row.getValue("tenthGen")}%
    //     </div>
    //   ),
    // },

    {
      accessorKey: "created_at",
      header: () => <div className="text-right font-medium">Created at</div>,
      cell: ({ row }) => {
        const dateStr: string = row.getValue("created_at");
        const date = parseISO(dateStr);
        if (isNaN(date.getTime())) {
          return <div className="text-right font-medium">Invalid Date</div>;
        }
        const formattedDate = format(date, "MMMM d, yyyy");
        return <div className="text-right font-medium">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "expiry_date",
      header: () => <div className="text-right font-medium">Expiry Date</div>,
      cell: ({ row }) => {
        const dateStr: string | null = row.getValue("expiry_date");
        if (!dateStr) {
          return <div className="text-right font-medium">Not set</div>;
        }
        const date = parseISO(dateStr);
        if (isNaN(date.getTime())) {
          return <div className="text-right font-medium">Invalid Date</div>;
        }
        const formattedDate = format(date, "MMMM d, yyyy");
        return <div className="text-right font-medium">{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const voucher = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(voucher.voucherId.toString())
                }
              >
                Copy Voucher ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View voucher details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full items-center justify-center">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter vouchers..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Popover>
          <PopoverTrigger>
            <Button className="ml-2" variant="outline">
              Advanced Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto m-2 z-50"
            align="start"
          >
            <AdvancedFilters onFilterChange={applyAdvancedFilters} />
          </PopoverContent>
        </Popover>
        <div className="flex-grow"></div>
        <Dialog>
          <Button className="ml-2" variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            <CSVLink data={data} filename={"voucher.csv"}>
              Export Template
            </CSVLink>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <IconUserUp className="mr-2 h-4 w-4" />
                Upload <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <IconUsersPlus />
                <div className="ml-1">Single</div>
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <IconFileTypeCsv />
                  <div className="ml-1">Import CSV</div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="w-3/4 max-w-none">
            <TelevisionCreation />
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-2" variant="outline">
              <IconColumns className="mr-2 h-4 w-4" />
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border h-full overflow-auto no-scrollbar">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Sheet key={row.id}>
                  <SheetTrigger asChild>
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => handleRowClick(row.original, row.index)}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent
                    side="top"
                    className="w-4/6 h-3/4 border rounded-2xl mx-auto mt-10 p-6 bg-background text-foreground"
                  >
                    <SheetHeader>
                      <SheetTitle>Edit Voucher</SheetTitle>
                      <SheetDescription>
                        Make changes to the voucher here. Click save when you're
                        done.
                      </SheetDescription>
                      <Separator />
                    </SheetHeader>
                    {!ifEditing ? (
                      <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                        <div className="w-full mt-8">
                          <Card className="w-full max-w-4xl mx-auto">
                            <CardContent className="p-6">
                              <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-6">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-lg font-semibold text-primary">
                                        Voucher ID
                                      </h3>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {
                                          voucherData[currentVoucherId]
                                            .tv_voucher_id
                                        }
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <h3 className="text-lg font-semibold text-primary">
                                        Card Number
                                      </h3>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {
                                          voucherData[currentVoucherId]
                                            .card_number
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-primary">
                                      Product Name
                                    </h3>
                                    <p className="text-sm font-medium text-muted-foreground">
                                      {
                                        voucherData[currentVoucherId]
                                          .product_name
                                      }
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h3 className="text-lg font-semibold text-primary">
                                        Amount
                                      </h3>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        ₱{voucherData[currentVoucherId].amount}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <h3 className="text-lg font-semibold text-primary">
                                        Discount
                                      </h3>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        ₱
                                        {voucherData[currentVoucherId].discount}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <h2 className="text-xl font-bold text-center text-primary">
                                    Generation Percentages
                                  </h2>
                                  <div className="grid grid-cols-2 gap-4">
                                    {[
                                      "firstGen",
                                      "secondGen",
                                      "thirdGen",
                                      "fourthGen",
                                      "fifthGen",
                                      "sixthGen",
                                      "seventhGen",
                                      "eighthGen",
                                      "ninthGen",
                                      "tenthGen",
                                    ].map((gen, idx) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between items-center"
                                      >
                                        <span className="text-sm font-medium text-muted-foreground">
                                          {idx + 1}th:
                                        </span>
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-semibold ${
                                            [
                                              "bg-blue-100 text-blue-800",
                                              "bg-green-100 text-green-800",
                                              "bg-yellow-100 text-yellow-800",
                                              "bg-red-100 text-red-800",
                                              "bg-purple-100 text-purple-800",
                                              "bg-indigo-100 text-indigo-800",
                                              "bg-pink-100 text-pink-800",
                                              "bg-gray-100 text-gray-800",
                                              "bg-teal-100 text-teal-800",
                                              "bg-orange-100 text-orange-800",
                                            ][idx]
                                          }`}
                                        >
                                          {voucherData[currentVoucherId][gen]}%
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 p-4 bg-muted rounded-lg">
                                <div className="flex justify-between items-center space-y-2">
                                  <span className="text-lg font-semibold text-primary">
                                    Amount:
                                  </span>
                                  <span className="text-xl font-bold text-green-600">
                                    ₱ {voucherData[currentVoucherId].amount}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center space-y-2">
                                  <span className="text-lg font-semibold text-primary">
                                    Discount:
                                  </span>
                                  <span className="text-xl font-bold text-orange-600">
                                    {voucherData[currentVoucherId].discount}%
                                  </span>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className="flex justify-end space-x-4 p-6 pt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit()}
                              >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="voucher-code">Serial Number</Label>
                            <Input
                              id="voucher-code"
                              placeholder="Voucher Code"
                              defaultValue={
                                voucherData[currentVoucherId].card_number
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="voucher-code">
                              Reference Number
                            </Label>
                            <Input
                              id="voucher-code"
                              placeholder="Voucher Code"
                              defaultValue={
                                voucherData[currentVoucherId].product_name
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="voucher-code">Product Code</Label>
                            <Input
                              id="voucher-code"
                              placeholder="Voucher Code"
                              defaultValue={
                                voucherData[currentVoucherId].productCode
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="voucher-amount">
                              Voucher Amount
                            </Label>
                            <Input
                              id="voucher-amount"
                              placeholder="Voucher Amount"
                              defaultValue={
                                voucherData[currentVoucherId].amount
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discount-amount">
                              Discount Amount
                            </Label>
                            <Input
                              id="discount-amount"
                              placeholder="Discount Amount"
                              defaultValue={
                                voucherData[currentVoucherId].discount
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input
                              id="expiry-date"
                              placeholder="Expiry Date"
                              type="datetime-local"
                            />
                          </div>
                        </div>
                        <div className="mt-6">
                          <Button className="w-full">Save Changes</Button>
                        </div>
                        <div className="mt-6">
                          <Button
                            onClick={() => handleEdit()}
                            className="w-full"
                            variant={"destructive"}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 flex flex-row items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            First Page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {Array.from(
            { length: table.getPageCount() },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={
                table.getState().pagination.pageIndex === pageNumber - 1
                  ? "ghost"
                  : "outline"
              }
              size="sm"
              onClick={() => table.setPageIndex(pageNumber - 1)}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            Last Page
          </Button>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Row Count</SelectLabel>
                {[10, 25, 50, 100, 250, 500].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
