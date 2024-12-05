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
import TelevisionCreation from "../tv-creation";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  CreditCard,
  Edit,
  RefreshCw,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type Voucher = {
  transactionId: any;
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

type TransactionHistory = {
  transactionId: string;
  productCode: string;
  amount: number;
  discount: number;
  distributorId: string;
  merchantId: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

interface TransactionInfoProps {
  transaction: {
    transactionId: string;
    productCode: string;
    amount: number;
    discount: number;
    merchantId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function TransactionHistoryTable({ setViewVoucher }: Props) {

  const [voucherData, setVoucherData] = useState<TransactionHistory[]>([]);
  const [currentVoucherId, setCurrentVoucherId] = useState<number>(0);
  const [ifEditing, setIfEditing] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [position, setPosition] = useState("all");

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [data, setData] = useState<Voucher[]>([]);

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
  const [getMerchants, setGetMerchants] = useState<any>([]);
  const [getDistributors, setGetDistributors] = useState<any>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<any>();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/transaction`)
      .then((response) => {
        setData(response.data);
        setVoucherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/distributor`)
      .then((response) => {
        setGetDistributors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching merchants:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/merchant`)
      .then((response) => {
        setGetMerchants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching merchants:", error);
      });
  }, []);

  console.log(data);

  const handleEdit = (transactionId: any) => {
    setIfEditing(!ifEditing);
    const merchantName = data.find((item) => item.transactionId === transactionId)?.usedMerchant;
    setSelectedMerchant(merchantName)
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
      accessorKey: "transactionId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Transaction ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("transactionId")}</div>
      ),
    },
    {
      accessorKey: "productCode",
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
        <div className="font-medium">{row.getValue("productCode")}</div>
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
        <div className="font-medium">₱ {row.getValue("amount")}</div>
      ),
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
      accessorKey: "createdAt",
      header: () => <div className="text-right font-medium">Created At</div>,
      cell: ({ row }) => {
        const dateStr: string | null = row.getValue("createdAt");
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
      accessorKey: "distributorId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Distributor
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("distributorId")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "merchantId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Merchant
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("merchantId")}</div>
      ),
      filterFn: fuzzyFilter,
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

                  {/* Sheet Content */}
                  <SheetContent
                    side="top"
                    className="w-5/6 border rounded-2xl mx-auto mt-56 p-6 bg-background text-foreground"
                  >
                    <SheetHeader>
                      <SheetTitle>Edit Transaction</SheetTitle>
                      <SheetDescription>
                        Make changes to the transaction here. Click save when
                        you're done.
                      </SheetDescription>
                      <Separator />
                    </SheetHeader>

                    {!ifEditing ? (
                      <div className="flex flex-col md:flex-row gap-8 items-start justify-between max-w-7xl mx-auto p-6">
                        {/* Transaction Details Card */}
                        <Card className="w-full md:w-3/5">
                          <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                              Transaction Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Transaction Info */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Transaction ID
                                </h3>
                                <p className="text-lg font-semibold">
                                  {voucherData[currentVoucherId]?.transactionId}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                  Product Code
                                </h3>
                                <p className="text-lg font-semibold">
                                  {voucherData[currentVoucherId]?.productCode}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            {/* Product Code & Amount */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" /> Amount
                                </h3>
                                <p className="text-lg font-semibold">
                                  ₱
                                  {voucherData[
                                    currentVoucherId
                                  ]?.amount.toFixed(2)}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                  <Tag className="mr-2 h-4 w-4" /> Discount
                                </h3>
                                <p className="text-lg font-semibold">
                                  {voucherData[currentVoucherId]?.discount}%
                                </p>
                              </div>
                            </div>
                            {/* Discount & Merchant */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                  <Tag className="mr-2 h-4 w-4" /> Distributor
                                </h3>
                                <p className="text-lg font-semibold">
                                  {voucherData[currentVoucherId]?.distributorId}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                  <User className="mr-2 h-4 w-4" /> Merchant
                                </h3>
                                <p className="text-lg font-semibold">
                                  {voucherData[currentVoucherId]?.merchantId ||
                                    "N/A"}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            {/* Created At & Updated At */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                  <Calendar className="mr-2 h-4 w-4" /> Created
                                  At
                                </h3>
                                <p className="text-base">
                                  {format(
                                    new Date(
                                      voucherData[currentVoucherId]?.createdAt
                                    ),
                                    "PPpp"
                                  )}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                  <RefreshCw className="mr-2 h-4 w-4" /> Updated
                                  At
                                </h3>
                                <p className="text-base">
                                  {format(
                                    new Date(
                                      voucherData[currentVoucherId]?.updatedAt
                                    ),
                                    "PPpp"
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end space-x-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIfEditing(true)}
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

                        {/* Vertical Separator */}
                        <Separator
                          orientation="vertical"
                          className="hidden md:block h-auto"
                        />

                        {/* Additional Information Card */}
                        <div className="w-full md:w-1/3">
                          <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                              Additional Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-primary">
                                Payment Method
                              </h3>
                              <p className="text-sm font-medium mt-1">
                                {voucherData[currentVoucherId]?.paymentMethod ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-primary">
                                Updated At
                              </h3>
                              <p className="text-sm font-medium mt-1">
                                {format(
                                  new Date(
                                    voucherData[currentVoucherId]?.updatedAt
                                  ),
                                  "PPpp"
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    ) : (
                      // Edit Form
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-code">Product Code</Label>
                            <Input
                              id="product-code"
                              placeholder="Product Code"
                              defaultValue={
                                voucherData[currentVoucherId]?.productCode
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Voucher Amount</Label>
                            <Input
                              id="amount"
                              placeholder="Voucher Amount"
                              defaultValue={
                                voucherData[currentVoucherId]?.amount
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discount">Discount Amount</Label>
                            <Input
                              id="discount"
                              placeholder="Discount Amount"
                              defaultValue={
                                voucherData[currentVoucherId]?.discount
                              }
                            />
                          </div>
                          <div className="space-y-2 flex flex-col mt-2">
                            <Label htmlFor="merchant">Merchant</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-full justify-between"
                                >
                                  {selectedMerchant
                                    ? selectedMerchant
                                    : "Select a merchant..."}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search merchant..."
                                    className="h-9"
                                  />
                                  <CommandList className="overflow-y-auto">
                                    <CommandEmpty>
                                      No merchant found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {getMerchants.map((merchant: any) => (
                                        <CommandItem
                                          key={merchant.id}
                                          value={merchant.id}
                                          onSelect={(currentValue) => {
                                            // When selecting, store the merchant's name as the selected value
                                            const selectedMerchant =
                                              getMerchants.find(
                                                (m: any) => m.id === currentValue
                                              )?.merchantName;
                                            setSelectedMerchant(
                                              selectedMerchant || ""
                                            );
                                            setOpen(false);
                                          }}
                                        >
                                          {merchant.merchantName}{" "}
                                          {/* Display merchantName */}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              selectedMerchant ===
                                                merchant.merchantName
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="discount">Merchant</Label>
                            <Input
                              id="discount"
                              placeholder="Discount Amount"
                              defaultValue={
                                voucherData[currentVoucherId]?.merchantId
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input
                              id="expiry-date"
                              type="datetime-local"
                              defaultValue={new Date(
                                voucherData[currentVoucherId]?.createdAt
                              )
                                .toISOString()
                                .slice(0, 16)}
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button className="w-full">Save Changes</Button>
                        </div>
                        <div className="mt-6">
                          <Button
                            onClick={() =>
                              handleEdit(
                                voucherData[currentVoucherId]?.transactionId
                              )
                            }
                            className="w-full"
                            variant="destructive"
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
