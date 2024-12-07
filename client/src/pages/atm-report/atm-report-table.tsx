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
  IconFilter,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CSVLink } from "react-csv";
import axios from "axios";
import {
  parseISO,
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AtmReportCreation from "./atm-report-creation";
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
  ArrowUpDown,
  CalendarIcon,
  CreditCard,
  Edit,
  PhilippinePeso,
  PoundSterlingIcon as PhilippinePesoIcon,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ATMDashboardPrint from "./atm-report-print";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import * as Slider from "@radix-ui/react-slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  setViewVoucher: any;
}

export default function AtmReportTable({ setViewVoucher }: Props) {
  const [voucherData, setVoucherData] = useState<any[]>([]);
  const [currentVoucherId, setCurrentVoucherId] = useState<number>(0);
  const [ifEditing, setIfEditing] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<
    "created_at" | "transaction_date"
  >("transaction_date");
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 100000]);
  const [, setStatusType] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setIsOpen(false);
    // Add your confirmation logic here, e.g., API call or action
  };

  const handleCancel = () => setIsOpen(false);

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/get-atm-transaction`)
      .then((response) => {
        setData(response.data);
        setVoucherData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const resetFilters = () => {
    setGlobalFilter("");
    setDateRange(undefined);
    setSelectedDateField("created_at");
    setTransactionTypes([]);
    setAmountRange([0, 100000]);
    setData(voucherData);
  };

  const fuzzyFilter = (row: any, columnId: any, value: any) => {
    const itemValue = row.getValue(columnId);
    return (
      typeof itemValue === "string" &&
      itemValue.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleRowClick = (voucher: any, rowId: number) => {
    setViewVoucher(voucher);
    setCurrentVoucherId(rowId);
    setIfEditing(false);
  };

  const handleTransactionTypeChange = (type: string) => {
    setTransactionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleAmountRangeChange = (value: number[]) => {
    setAmountRange([value[0], value[1]]);
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

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const handleDateFieldChange = (value: string) => {
    if (value === "created_at" || value === "transaction_date") {
      setSelectedDateField(value);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusType(value);
    if (value === "all") {
      setData(voucherData);
    } else {
      const filteredData = voucherData.filter(
        (item) => item.status.toLowerCase() === value.toLowerCase()
      );
      setData(filteredData);
    }
  };

  const calculateStatistics = (filteredData: any[]) => {
    return {
      totalWithdraw: filteredData.reduce(
        (sum, item) => sum + Number(item.withdraw_amount || 0),
        0
      ),
      totalWithdrawCount: filteredData.reduce(
        (sum, item) => sum + Number(item.withdraw_count || 0),
        0
      ),
      totalFundTransfer: filteredData.reduce(
        (sum, item) => sum + Number(item.fund_transfer_amount || 0),
        0
      ),
      totalFundTransferCount: filteredData.reduce(
        (sum, item) => sum + Number(item.fund_transfer_count || 0),
        0
      ),
      totalBillsPayment: filteredData.reduce(
        (sum, item) => sum + Number(item.bills_payment_amount || 0),
        0
      ),
      totalCashIn: filteredData.reduce(
        (sum, item) => sum + Number(item.cash_in_amount || 0),
        0
      ),
      totalTransactionCount: filteredData.reduce(
        (sum, item) => sum + Number(item.total_transaction_count || 0),
        0
      ),
    };
  };

  const applyAdvancedFilters = () => {
    const filteredData = voucherData.filter((item) => {
      let itemDate;

      itemDate = parseISO(item[selectedDateField]);

      const isInDateRange = dateRange
        ? isWithinInterval(itemDate, {
            start: startOfDay(dateRange.from!),
            end: endOfDay(dateRange.to || dateRange.from!),
          })
        : true;

      const matchesGlobalFilter =
        !globalFilter ||
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(globalFilter.toLowerCase())
        );

      const matchesTransactionType =
        transactionTypes.length === 0 ||
        (item.withdraw_count > 0 && transactionTypes.includes("withdraw")) ||
        (item.balance_inquiry_count > 0 &&
          transactionTypes.includes("balance_inquiry")) ||
        (item.fund_transfer_count > 0 &&
          transactionTypes.includes("fund_transfer"));

      const isInAmountRange =
        Number(item.total_amount) >= amountRange[0] &&
        Number(item.total_amount) <= amountRange[1];

      const statusType = item.status.toLowerCase();

      const matchesStatusType = statusType
        ? item.status.toLowerCase() === statusType.toLowerCase()
        : true;

      return (
        isInDateRange &&
        matchesGlobalFilter &&
        matchesTransactionType &&
        isInAmountRange &&
        matchesStatusType
      );
    });

    setData(filteredData);
    setIsFilterPopoverOpen(false);
  };

  const stats = calculateStatistics(data);

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "merchant_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Merchant ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("merchant_id")}</div>
      ),
    },
    {
      accessorKey: "merchant_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Merchant Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("merchant_name")}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "transaction_date",
      header: () => <div className="text-right font-medium">Transaction</div>,
      cell: ({ row }) => {
        const dateStr: string | null = row.getValue("transaction_date");
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
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Status
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status");
        let statusText = "";
        let bgColor = "";

        // Conditional rendering and background color based on the status
        if (status === "unchecked") {
          statusText = "Unchecked";
          bgColor = "bg-gray-200 text-gray-700"; // Light gray for unchecked
        } else if (status === "unverified") {
          statusText = "Unverified";
          bgColor = "bg-yellow-200 text-yellow-700"; // Yellow for unverified
        } else if (status === "verified") {
          statusText = "Verified";
          bgColor = "bg-green-500 text-green-100"; // Green for verified
        }

        return (
          <div
            className={`font-medium ${bgColor} dark:bg-blue-900 dark:text-blue-300`}
          >
            {statusText}
          </div>
        );
      },
    },

    {
      accessorKey: "withdraw_count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Withdraw Count
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-blue-100 dark:bg-blue-900 dark:text-blue-300 text-blue-700">
          {row.getValue("withdraw_count")}
        </div>
      ),
    },
    {
      accessorKey: "balance_inquiry_count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Balance Inquiry Count
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-green-100 dark:bg-green-900 dark:text-green-300 text-green-700">
          {row.getValue("balance_inquiry_count")}%
        </div>
      ),
    },
    {
      accessorKey: "fund_transfer_count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Fund Transfer Count
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 text-yellow-700">
          {row.getValue("fund_transfer_count")}%
        </div>
      ),
    },
    {
      accessorKey: "total_transaction_count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Total Transaction Count
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-red-100 dark:bg-red-900 dark:text-red-300 text-red-700">
          {row.getValue("total_transaction_count")}
        </div>
      ),
    },
    {
      accessorKey: "withdraw_amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Withdraw Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 text-indigo-700">
          ₱ {row.getValue("withdraw_amount")}
        </div>
      ),
    },
    {
      accessorKey: "balance_inquiry_amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Balance Inquiry Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-pink-100 dark:bg-pink-900 dark:text-pink-300 text-pink-700">
          ₱ {row.getValue("balance_inquiry_amount")}
        </div>
      ),
    },
    {
      accessorKey: "fund_transfer_amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Fund Transfer Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-purple-100 dark:bg-purple-900 dark:text-purple-300 text-purple-700">
          ₱ {row.getValue("fund_transfer_amount")}
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Total Amount
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium bg-gray-100 dark:bg-gray-900 dark:text-gray-300 text-gray-700">
          ₱ {row.getValue("total_amount")}
        </div>
      ),
    },

    {
      accessorKey: "created_at",
      header: () => <div className="text-right font-medium">Created</div>,
      cell: ({ row }) => {
        const dateStr: string | null = row.getValue("created_at");
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
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
      <div className="mb-4 flex flex-row justify-between">
        <Popover
          open={isFilterPopoverOpen}
          onOpenChange={setIsFilterPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">
              <IconFilter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Date Field</h4>
                <Select
                  value={selectedDateField}
                  onValueChange={handleDateFieldChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created At</SelectItem>
                    <SelectItem value="transaction_date">
                      Transaction Date
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Date Range</h4>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={handleDateChange}
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Transaction Types</h4>
                <div className="flex flex-wrap gap-2">
                  {["withdraw", "balance_inquiry", "fund_transfer"].map(
                    (type) => (
                      <Button
                        key={type}
                        variant={
                          transactionTypes.includes(type)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleTransactionTypeChange(type)}
                        className="capitalize"
                      >
                        {type.replace("_", " ")}
                      </Button>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Amount Range</h4>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={amountRange}
                  onValueChange={handleAmountRangeChange}
                  min={0}
                  max={100000}
                  step={1000}
                >
                  <Slider.Track className="bg-slate-200 relative grow rounded-full h-[3px]">
                    <Slider.Range className="absolute bg-slate-900 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white shadow-[0_0px_3px] shadow-slate-700 rounded-[10px] hover:bg-slate-100 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-slate-200"
                    aria-label="Min amount"
                  />
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white shadow-[0_0px_3px] shadow-slate-700 rounded-[10px] hover:bg-slate-100 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-slate-200"
                    aria-label="Max amount"
                  />
                </Slider.Root>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₱{amountRange[0]}</span>
                  <span>₱{amountRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={applyAdvancedFilters}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" onClick={() => handleStatusChange("all")}>
              All
            </TabsTrigger>
            <TabsTrigger
              value="unchecked"
              onClick={() => handleStatusChange("unchecked")}
            >
              Unchecked
            </TabsTrigger>
            <TabsTrigger
              value="unverified"
              onClick={() => handleStatusChange("unverified")}
            >
              Unverified
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              onClick={() => handleStatusChange("verified")}
            >
              Verified
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              onClick={() => handleStatusChange("rejected")}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
            <PhilippinePeso className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalWithdrawCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Amount: ₱ {stats.totalWithdraw.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fund Transfers
            </CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalFundTransferCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Amount: ₱ {stats.totalFundTransfer.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱ {stats.totalBillsPayment.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash In</CardTitle>
            <PhilippinePesoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱ {stats.totalCashIn.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        {/* New Card for Total Transaction Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <IconColumns className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTransactionCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All transaction types
            </p>
          </CardContent>
        </Card>

        {/* ... (keep other stat cards) */}
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Global filter..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm mr-4"
        />

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
            <AtmReportCreation />
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
      <div className="rounded-md border overflow-scroll no-scrollbar">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
                    className="w-5/6 border rounded-2xl mx-auto p-6 bg-background text-foreground"
                  >
                    <SheetHeader>
                      <SheetTitle>Transaction Details</SheetTitle>
                      <SheetDescription>
                        Check and validate your transaction details
                      </SheetDescription>
                      <Separator />
                    </SheetHeader>
                    {!ifEditing ? (
                      <ScrollArea className="h-[calc(100vh-10rem)]">
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 p-6">
                          <div className="space-y-8">
                            <div className="flex flex-row justify-between">
                              <ATMDashboardPrint
                                voucherData={voucherData}
                                currentVoucherId={currentVoucherId}
                              />
                              {voucherData[currentVoucherId].status ===
                                "unchecked" && (
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => setIsOpen(true)}
                                    >
                                      Check
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent
                                    className="max-w-md rounded-lg p-6 animate-fadeIn"
                                    style={{
                                      animationDuration: "300ms",
                                      animationTimingFunction: "ease-out",
                                    }}
                                  >
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-semibold text-center">
                                        Are you sure?
                                      </DialogTitle>
                                    </DialogHeader>
                                    <p className="text-center text-gray-600 mt-2">
                                      This action is irreversible. Please
                                      confirm if you want to proceed.
                                    </p>
                                    <DialogFooter className="mt-4 flex justify-center space-x-4">
                                      <Button
                                        variant="destructive"
                                        onClick={handleConfirm}
                                      >
                                        Yes, Confirm
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                      >
                                        Cancel
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center">
                                  <CreditCard className="mr-2 h-5 w-5" />{" "}
                                  Transaction Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Detail
                                    title="Merchant ID"
                                    value={
                                      voucherData[currentVoucherId].merchant_id
                                    }
                                  />
                                  <Detail
                                    title="Merchant Name"
                                    value={
                                      voucherData[currentVoucherId]
                                        .merchant_name
                                    }
                                  />
                                  <Detail
                                    title="Transaction Date"
                                    value={new Date(
                                      voucherData[
                                        currentVoucherId
                                      ].transaction_date
                                    ).toLocaleString()}
                                  />
                                  <Detail
                                    title="Status"
                                    value={
                                      voucherData[currentVoucherId].status ||
                                      "Waiting"
                                    }
                                    isBadge
                                  />
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm">
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

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center">
                                  <ArrowUpDown className="mr-2 h-5 w-5" />{" "}
                                  Transaction Counts
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Detail
                                    title="Withdraw Count"
                                    value={
                                      voucherData[currentVoucherId]
                                        .withdraw_count
                                    }
                                  />
                                  <Detail
                                    title="Balance Inquiry Count"
                                    value={
                                      voucherData[currentVoucherId]
                                        .balance_inquiry_count
                                    }
                                  />
                                  <Detail
                                    title="Fund Transfer Count"
                                    value={
                                      voucherData[currentVoucherId]
                                        .fund_transfer_count
                                    }
                                  />
                                  <Separator className="my-2" />
                                  <Detail
                                    title="Total Transaction Count"
                                    value={
                                      voucherData[currentVoucherId]
                                        .total_transaction_count
                                    }
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="space-y-8">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center">
                                  <PhilippinePesoIcon className="mr-2 h-5 w-5" />{" "}
                                  Transaction Amounts
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Detail
                                    title="Withdraw Amount"
                                    value={Number(
                                      voucherData[currentVoucherId]
                                        .withdraw_amount || 0
                                    )}
                                    isCurrency
                                  />
                                  <Detail
                                    title="Balance Inquiry Amount"
                                    value={Number(
                                      voucherData[currentVoucherId]
                                        .balance_inquiry_amount || 0
                                    )}
                                    isCurrency
                                  />
                                  <Detail
                                    title="Fund Transfer Amount"
                                    value={Number(
                                      voucherData[currentVoucherId]
                                        .fund_transfer_amount || 0
                                    )}
                                    isCurrency
                                  />
                                  <Separator className="my-2" />
                                  <Detail
                                    title="Total Amount"
                                    value={Number(
                                      voucherData[currentVoucherId]
                                        .total_amount || 0
                                    )}
                                    isCurrency
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center">
                                  <PhilippinePesoIcon className="mr-2 h-5 w-5" />{" "}
                                  Transaction Fees
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Detail
                                    title="Transaction Fee (RCBC)"
                                    value={Number(
                                      voucherData[currentVoucherId]
                                        .transaction_fee_rcbc || 0
                                    )}
                                    isCurrency
                                  />
                                  <Detail
                                    title="Transaction Fee (Merchant)"
                                    value={Number(
                                      voucherData[currentVoucherId]
                                        .transaction_fee_merchant || 0
                                    )}
                                    isCurrency
                                  />
                                  <Separator className="my-2" />
                                  <Detail
                                    title="Total Fees"
                                    value={
                                      Number(
                                        voucherData[currentVoucherId]
                                          .transaction_fee_rcbc || 0
                                      ) +
                                      Number(
                                        voucherData[currentVoucherId]
                                          .transaction_fee_merchant || 0
                                      )
                                    }
                                    isCurrency
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </ScrollArea>
                    ) : (
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="merchant-id">Merchant ID</Label>
                            <Input
                              id="merchant-id"
                              placeholder="Merchant ID"
                              defaultValue={
                                voucherData[currentVoucherId].merchant_id
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="merchant-name">Merchant Name</Label>
                            <Input
                              id="merchant-name"
                              placeholder="Merchant Name"
                              defaultValue={
                                voucherData[currentVoucherId].merchant_name
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="transaction-date">
                              Transaction Date
                            </Label>
                            <Input
                              id="transaction-date"
                              placeholder="Transaction Date"
                              type="date"
                              defaultValue={
                                new Date(
                                  voucherData[currentVoucherId].transaction_date
                                )
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="withdraw-count">
                              Withdraw Count
                            </Label>
                            <Input
                              id="withdraw-count"
                              placeholder="Withdraw Count"
                              type="number"
                              defaultValue={
                                voucherData[currentVoucherId].withdraw_count
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="total-amount">Total Amount</Label>
                            <Input
                              id="total-amount"
                              placeholder="Total Amount"
                              type="number"
                              defaultValue={
                                voucherData[currentVoucherId].total_amount
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiry-date">Expiry Date</Label>
                            <Input
                              id="expiry-date"
                              placeholder="Expiry Date"
                              type="date"
                              defaultValue={
                                voucherData[currentVoucherId].expiry_date
                                  ? new Date(
                                      voucherData[currentVoucherId].expiry_date
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
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

function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const Detail: React.FC<any> = ({
  title,
  value,
  isCurrency = false,
  isBadge = false,
}) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm font-medium text-gray-500">{title}</span>
    {isBadge ? (
      <Badge variant={value === "Waiting" ? "secondary" : "default"}>
        {value}
      </Badge>
    ) : (
      <span className="text-sm font-semibold">
        {isCurrency ? `₱ ${Number(value || 0).toFixed(2)}` : value}
      </span>
    )}
  </div>
);
