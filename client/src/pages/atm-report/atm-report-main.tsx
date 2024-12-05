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
import AtmReportTable from "./atm-report-table";
import { useState } from "react";

const AtmMain = () => {
  const [viewVoucher, setViewVoucher] = useState<any>([]);
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
          <p className="text-3xl font-bold">ATM Reporting</p>
          <p className="text-muted-foreground mt-2">
            Configure and manage ATM details and communication settings.
            settings.
          </p>
          <Separator className="my-6" />
        </div>
        <div className="w-full px-4">
          {/* New Wrapper Div with Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* ATM Report Table inside the Grid */}
            <div className="col-span-full lg:col-span-10 xl:col-span-12 overflow-auto">
              <AtmReportTable setViewVoucher={setViewVoucher} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtmMain;
