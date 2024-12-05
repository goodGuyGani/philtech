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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import GsatCreation from "./gsat-creation";
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
import { Badge } from "@/components/ui/badge";

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

export default function GsatTable({ setViewVoucher }: Props) {
  const [voucherData, setVoucherData] = useState<any[]>([]);
  const [currentVoucherId, setCurrentVoucherId] = useState<number>(0);
  const [ifEditing, setIfEditing] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [position, setPosition] = useState("all");


  const [data, setData] = useState<Voucher[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/gsat-vouchers`)
      .then((response) => {
        setData(response.data);
        setVoucherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const fuzzyFilter = (row: any, columnId: any, value: any, addMeta: any) => {
    const itemValue = row.getValue(columnId);
    return (
      typeof itemValue === "string" &&
      itemValue.toLowerCase().includes(value.toLowerCase())
    );
  };

  console.log(voucherData);

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
  const [rowSelection, setRowSelection] = useState({});

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
      accessorKey: "gsat_voucher_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("gsat_voucher_id")}</div>
      ),
    },
    {
      accessorKey: "serial_number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Serial Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("serial_number")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "reference_number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Reference Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("reference_number")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "product_code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Product Code
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("product_code")}</div>
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
    },
    {
      accessorKey: "used_date",
      header: () => <div className="text-right font-medium">Used Date</div>,
      cell: ({ row }) => {
        const dateStr: string | null = row.getValue("used_date");
        if (!dateStr) {
          return <div className="text-right font-medium">Not used</div>;
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
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
          <div className="flex-grow"></div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Product Code <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={(value) => {
                    setPosition(value);
                    // Apply the filter for productCode
                    setColumnFilters((prev) => [
                      ...prev.filter((filter) => filter.id !== "productCode"), // Remove existing productCode filter
                      ...(value !== "all"
                        ? [{ id: "productCode", value }]
                        : []), // Add new filter if not "all"
                    ]);
                  }}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fg99">
                    FG99
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="g200">
                    G200
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="g300">
                    G300
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="g500">
                    G500
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

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
              <GsatCreation />
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
      <div className="rounded-md border h-[calc(100vh-28rem)] overflow-auto no-scrollbar">
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
                    className="w-5/6 border rounded-2xl mx-auto mt-56 p-6 bg-background text-foreground"
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
                      <div className="flex flex-row gap-8 items-center justify-center">
                        <div className="w-full max-w-xl mt-8">
                          <Card>
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-semibold text-primary">
                                      Serial Number
                                    </h3>
                                    <p className="text-sm font-medium">
                                      {
                                        voucherData[currentVoucherId]
                                          .serial_number
                                      }
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <h3 className="text-lg font-semibold text-primary">
                                      Reference Number
                                    </h3>
                                    <p className="text-sm font-medium">
                                      {
                                        voucherData[currentVoucherId]
                                          .reference_number
                                      }
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    Product Code
                                  </h3>
                                  <p className="text-sm font-medium">
                                    {voucherData[currentVoucherId].product_code}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="text-lg font-semibold text-primary">
                                      Amount
                                    </h3>
                                    <p className="text-sm font-medium">
                                      ₱
                                      {voucherData[
                                        currentVoucherId
                                      ].amount.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <h3 className="text-lg font-semibold text-primary">
                                      Discount
                                    </h3>
                                    <p className="text-sm font-medium">
                                      ₱
                                      {voucherData[
                                        currentVoucherId
                                      ].discount.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2 p-6 pt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit()}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                        <Separator
                          orientation="vertical"
                          className="mt-8 h-auto border-l"
                        />
                        <div className="w-full max-w-xl mt-8">
                          <div>
                            <div className="p-6">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    Status
                                  </h3>
                                  <Badge>
                                    {voucherData[currentVoucherId].status ==
                                    "null"
                                      ? "Waiting"
                                      : voucherData[currentVoucherId].status}
                                  </Badge>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    Expiry Date
                                  </h3>
                                  <p className="text-sm font-medium">
                                    {voucherData[currentVoucherId].expiry_date
                                      ? new Date(
                                          voucherData[
                                            currentVoucherId
                                          ].expiryDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    Used Date
                                  </h3>
                                  <p className="text-sm font-medium">
                                    {voucherData[currentVoucherId].used_date
                                      ? new Date(
                                          voucherData[currentVoucherId].used_date
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    Used By
                                  </h3>
                                  <p className="text-sm font-medium">
                                    {voucherData[currentVoucherId]
                                      .usedMerchant || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    Sold By
                                  </h3>
                                  <p className="text-sm font-medium">N/A</p>
                                </div>
                              </div>
                            </div>
                          </div>
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
                                voucherData[currentVoucherId].serial_number
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
                                voucherData[currentVoucherId].reference_number
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="voucher-code">Product Code</Label>
                            <Input
                              id="voucher-code"
                              placeholder="Voucher Code"
                              defaultValue={
                                voucherData[currentVoucherId].product_code
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
