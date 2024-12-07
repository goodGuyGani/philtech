"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import ThemeSwitch from "@/components/theme-switcher"
import { TransactionChart, UserChart, VoucherChart } from "@/components/dashboard-charts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconCurrencyPeso,
  IconDoorExit,
  IconHourglassEmpty,
  IconUsersGroup,
} from "@tabler/icons-react"

interface AtmTransaction {
  ID: number;
  merchant_id: string;
  merchant_name: string;
  transaction_date: string;
  withdraw_count: number;
  balance_inquiry_count: number;
  fund_transfer_count: number;
  total_transaction_count: number;
  withdraw_amount: string;
  balance_inquiry_amount: string;
  fund_transfer_amount: string;
  total_amount: string;
  transaction_fee_rcbc: string;
  transaction_fee_merchant: string;
  created_at: string;
  status: string;
}

interface User {
  ID: number;
  user_login: string;
  user_email: string;
  user_registered: string;
  user_credits: number;
}

interface GsatVoucher {
  gsat_voucher_id: number;
  serial_number: string;
  amount: number;
  status: string;
  created_at: string;
}

interface WifiVoucher {
  wifi_voucher_id: number;
  code: string;
  amount: number;
  status: string;
  created_at: string;
}

interface TvVoucher {
  tv_voucher_id: number;
  card_number: string;
  amount: number;
  status: string;
  created_at: string;
}

const DashboardMain = () => {
  const [atmTransactions, setAtmTransactions] = useState<AtmTransaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [gsatVouchers, setGsatVouchers] = useState<GsatVoucher[]>([]);
  const [wifiVouchers, setWifiVouchers] = useState<WifiVoucher[]>([]);
  const [tvVouchers, setTvVouchers] = useState<TvVoucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [atmResponse, usersResponse, gsatResponse, wifiResponse, tvResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/get-atm-transaction`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/gsat-vouchers`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/wifi-vouchers`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/tv-vouchers`),
        ]);
        setAtmTransactions(atmResponse.data);
        setUsers(usersResponse.data);
        setGsatVouchers(gsatResponse.data);
        setWifiVouchers(wifiResponse.data);
        setTvVouchers(tvResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const totalTransactions = atmTransactions.reduce((sum, transaction) => sum + transaction.total_transaction_count, 0);
  const totalAmount = atmTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.total_amount), 0);
  const totalUsers = users.length;
  const totalVouchers = gsatVouchers.length + wifiVouchers.length + tvVouchers.length;

  return (
    <div className="w-full">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeSwitch />
        </div>
      </header>

      <div className="flex flex-col w-full p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>

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
                    Total Transactions
                  </CardTitle>
                  <IconUsersGroup className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">From ATM transactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount
                  </CardTitle>
                  <IconCurrencyPeso className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₱ {totalAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">From ATM transactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <IconDoorExit className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
                  <IconHourglassEmpty className="stroke-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalVouchers}</div>
                  <p className="text-xs text-muted-foreground">GSAT, WiFi, and TV vouchers</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <TransactionChart />
              <UserChart />
            </div>

            <div className="mt-8">
              <VoucherChart />
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent ATM Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">Merchant</th>
                          <th className="text-left">Date</th>
                          <th className="text-right">Total Count</th>
                          <th className="text-right">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {atmTransactions.slice(0, 5).map((transaction) => (
                          <tr key={transaction.ID}>
                            <td>{transaction.merchant_name}</td>
                            <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                            <td className="text-right">{transaction.total_transaction_count}</td>
                            <td className="text-right">₱{parseFloat(transaction.total_amount).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="Analytics">
            {/* Add more detailed analytics content here */}
          </TabsContent>
          <TabsContent value="Reports">
            {/* Add reporting features here */}
          </TabsContent>
          <TabsContent value="Notifications">
            {/* Add notification center here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardMain

