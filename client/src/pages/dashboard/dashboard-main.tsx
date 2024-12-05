import ThemeSwitch from "@/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCurrencyPeso,
  IconDoorExit,
  IconHourglassEmpty,
  IconUsersGroup,
} from "@tabler/icons-react";

const DashboardMain = () => {
  return (
    <div className="w-full">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeSwitch />
        </div>
      </header>

      {/* Ensure the full width here */}
      <div className="flex flex-col w-full p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-4xl font-bold">Dashboard</p>
        </div>

        {/* Full width grid container */}
        <Tabs defaultValue="Overview" className="w-full mt-3">
          <TabsList>
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="Analytics">Analytics</TabsTrigger>
            <TabsTrigger value="Reports">Reports</TabsTrigger>
            <TabsTrigger value="Notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="Overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Monthly Income
                  </CardTitle>
                  <IconCurrencyPeso className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₱ 93,542.54</div>
                  <p className="text-xs text-muted-foreground">+25.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <IconUsersGroup className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">154</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
                  <IconDoorExit className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">35</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
                  <IconHourglassEmpty className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+13% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardMain;
