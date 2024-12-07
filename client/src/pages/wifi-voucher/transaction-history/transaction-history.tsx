import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IconFilter,
  IconHours24,
  IconUsersGroup,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WifiTransactionHistoryTable from "./transaction-history-table";

interface Voucher {
  voucherId: number;
  voucherCode: string;
  voucherAmount: number;
  discountAmount: number;
  voucherStatus: string;
  expiryDate: string;
  issuedDate?: string;
  usedDate?: string;
}

const WifiTransactionHistory = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [, setViewVoucher] = useState<Voucher>({
    voucherId: 0, // Initialize with a default numeric value
    voucherCode: "", // Matches string type in the interface
    voucherAmount: 0, // Initialize with a default numeric value
    discountAmount: 0, // Initialize with a default numeric value
    voucherStatus: "", // Matches string type in the interface
    expiryDate: "", // Matches string type in the interface
    issuedDate: "", // Matches optional string type in the interface
    usedDate: "", // Matches optional string type in the interface
  });

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <div className="main-content h-full w-full mt-5">
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full max-w-9xl px-4 pt-6">
          <p className="text-3xl font-bold">Transaction History</p>
          <p className="text-muted-foreground mt-2">
            Here the transaction history of the WiFi Vouchers
          </p>
          <Separator className="my-6" />
        </div>
        <div
          className={`flex flex-col gap-4 justify-between w-full px-4`}
        >
          <p className="text-2xl font-bold">WiFi Voucher History</p>
          <div className="flex flex-row gap-2">
            <Button variant="outline">
              <IconFilter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <div className={cn("grid gap-2", className)}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-56 justify-start text-left font-normal",
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
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Input
              className="w-56"
              type="text"
              id="text"
              placeholder="Search by Name or ID"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4 w-full px-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Wifi Vouchers
              </CardTitle>
              <IconUsersGroup className="stroke-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total WiFi Vouchers Unused
              </CardTitle>
              <IconUsersGroup className="stroke-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">154</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total WiFi Voucher Used</CardTitle>
              <IconHours24 className="stroke-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">102</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="w-full px-4">
          <WifiTransactionHistoryTable
            setViewVoucher={setViewVoucher}
          />
        </div>
      </div>
    </div>
  );
};

export default WifiTransactionHistory;
