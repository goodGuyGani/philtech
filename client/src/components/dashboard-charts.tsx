import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

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

export function TransactionChart() {
  const [transactionData, setTransactionData] = useState<AtmTransaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-atm-transaction');
        setTransactionData(response.data);
      } catch (error) {
        console.error("Failed to fetch ATM transactions:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = transactionData.map(transaction => ({
    date: transaction.transaction_date.split(' ')[0],
    withdrawCount: transaction.withdraw_count,
    balanceInquiryCount: transaction.balance_inquiry_count,
    fundTransferCount: transaction.fund_transfer_count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATM Transaction Overview</CardTitle>
        <CardDescription>Daily transaction counts from ATM data</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            withdrawCount: {
              label: "Withdrawals",
              color: "hsl(var(--chart-1))",
            },
            balanceInquiryCount: {
              label: "Balance Inquiries",
              color: "hsl(var(--chart-2))",
            },
            fundTransferCount: {
              label: "Fund Transfers",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="withdrawCount" stroke="var(--color-withdrawCount)" strokeWidth={2} />
              <Line type="monotone" dataKey="balanceInquiryCount" stroke="var(--color-balanceInquiryCount)" strokeWidth={2} />
              <Line type="monotone" dataKey="fundTransferCount" stroke="var(--color-fundTransferCount)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function UserChart() {
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = userData.map(user => ({
    date: new Date(user.user_registered).toISOString().split('T')[0],
    credits: user.user_credits,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Credits Overview</CardTitle>
        <CardDescription>User credits by registration date</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            credits: {
              label: "User Credits",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="credits" stroke="var(--color-credits)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function VoucherChart() {
  const [gsatVouchers, setGsatVouchers] = useState<GsatVoucher[]>([]);
  const [wifiVouchers, setWifiVouchers] = useState<WifiVoucher[]>([]);
  const [tvVouchers, setTvVouchers] = useState<TvVoucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gsatResponse, wifiResponse, tvResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/gsat-vouchers`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/wifi-vouchers`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/api/tv-vouchers`)
        ]);
        setGsatVouchers(gsatResponse.data);
        setWifiVouchers(wifiResponse.data);
        setTvVouchers(tvResponse.data);
      } catch (error) {
        console.error("Failed to fetch voucher data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { type: 'GSAT', count: gsatVouchers.length },
    { type: 'WiFi', count: wifiVouchers.length },
    { type: 'TV', count: tvVouchers.length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voucher Distribution</CardTitle>
        <CardDescription>Count of different voucher types</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            count: {
              label: "Voucher Count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="type" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
