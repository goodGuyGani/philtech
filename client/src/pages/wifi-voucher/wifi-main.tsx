import ThemeSwitch from "@/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDoorExit, IconHours24, IconUsersGroup } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import WifiTable from "./wifi-table";

const WifiMain = () => {
  const [, setViewVoucher] = useState<any>([]);
  return (
    <div className="max-w-screen">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Report</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>ATM Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeSwitch />
        </div>
      </header>

      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col w-full max-w-9xl px-4 pt-6">
          <p className="text-3xl font-bold">WiFi Vouchers</p>
          <p className="text-muted-foreground mt-2">
            Configure and manage wifi voucher details and communication
            settings.
          </p>
          <Separator className="my-6" />
        </div>

        <div className="w-full max-w-9xl px-4">
          <p className="text-2xl font-bold">Wifi Voucher Tracking</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 mt-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Income
                </CardTitle>
                <IconUsersGroup className="stroke-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Php 456,000</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Wifi Vouchers
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
                <CardTitle className="text-sm font-medium">
                  Total Used
                </CardTitle>
                <IconHours24 className="stroke-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">102</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Unused
                </CardTitle>
                <IconDoorExit className="stroke-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">35</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>

            <Link to="/dashboard/wifi-voucher/transaction-history">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transaction History
                  </CardTitle>
                  <IconDoorExit className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">110</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="w-full px-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-full lg:col-span-10 xl:col-span-12 overflow-auto">
              <WifiTable setViewVoucher={setViewVoucher} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WifiMain;
