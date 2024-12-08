import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { CreditCard, Package, User, Users, Edit, PlusCircle, Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// interface UserProfile {
//   ID: number
//   user_login: string
//   user_nicename: string
//   user_email: string
//   user_url: string
//   user_registered: string
//   user_status: number
//   display_name: string
//   user_role: string
//   user_level: number
//   user_upline_id: number
//   user_credits: number
//   user_referral_code: string
//   user_referred_by_id: number
// }

const mockTransactions = [
  {
    id: 1,
    amount: 1000,
    date: "2024-12-01",
    type: "Top-Up",
    status: "Success",
    description: "Added funds",
  },
  {
    id: 2,
    amount: 500,
    date: "2024-12-03",
    type: "Purchase",
    status: "Failed",
    description: "Purchase declined",
  },
  {
    id: 3,
    amount: 1500,
    date: "2024-12-05",
    type: "Top-Up",
    status: "Success",
    description: "Added funds",
  },
  {
    id: 4,
    amount: 200,
    date: "2024-12-07",
    type: "Refund",
    status: "Success",
    description: "Refund processed",
  },
  {
    id: 5,
    amount: 700,
    date: "2024-12-08",
    type: "Purchase",
    status: "Success",
    description: "Purchase completed",
  },
]

export default function UserDashboardMain() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTopUpModalOpen, setTopUpModalOpen] = useState(false)
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions)
  const [transactionType, setTransactionType] = useState("all")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const handleFilterChange = () => {
    let filtered = [...mockTransactions]

    if (transactionType && transactionType !== 'all') {
      filtered = filtered.filter((tx) => tx.type === transactionType)
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(
        (tx) =>
          new Date(tx.date) >= new Date(dateRange.start) &&
          new Date(tx.date) <= new Date(dateRange.end)
      )
    }

    setFilteredTransactions(filtered)
  }

  useEffect(() => {
    if (!userId) {
      setError("Invalid user ID.")
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`)
        setProfile(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to fetch profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleTopUp = () => {
    setTopUpModalOpen(true)
  }

  const handleHistory = () => {
    setHistoryModalOpen(true)
  }

  if (loading) return <DashboardSkeleton />
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="w-full max-w-6xl px-4 py-8 mx-auto md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.display_name}</h2>
                  <p className="text-muted-foreground">{profile?.user_email}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.user_role.charAt(0).toUpperCase() + profile?.user_role.slice(1)} • Level {profile?.user_level}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Profile Completion</p>
                <p className="text-sm font-medium">75%</p>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₱{profile?.user_credits.toLocaleString()}.00</div>
            <p className="mt-2 text-sm opacity-90">Referral Code: {profile?.user_referral_code}</p>
          </CardContent>
          <CardFooter className="p-0">
            <div className="grid w-full grid-cols-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="flex items-center justify-center gap-2 rounded-none rounded-bl-lg hover:bg-secondary/80"
                      onClick={handleTopUp}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Top-up
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add more credits to your account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="flex items-center justify-center gap-2 rounded-none rounded-br-lg hover:bg-secondary/80"
                      onClick={handleHistory}
                    >
                      <Clock className="w-4 h-4" />
                      History
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View your credit transaction history</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-3">
        <DashboardCard
          title="ATM Transactions"
          value={15}
          description="Total ATM transactions"
          icon={CreditCard}
        />
        <DashboardCard
          title="Activation Codes"
          value={5}
          description="Active subscription packages"
          icon={Package}
          onClick={() => navigate(`/user-dashboard/${userId}/subscription-packages`)}
        />
        <DashboardCard
          title="My Organization"
          value={8}
          description="5 merchants, 3 distributors"
          icon={Users}
          onClick={() => navigate(`/user-dashboard/${userId}/user-genealogy`)}
        />
      </div>

      <TopUpModal isOpen={isTopUpModalOpen} onClose={() => setTopUpModalOpen(false)} />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        transactions={filteredTransactions}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleFilterChange={handleFilterChange}
      />
    </div>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  onClick,
}: {
  title: string
  value: number
  description: string
  icon: React.ElementType
  onClick?: () => void
}) {
  return (
    <Card
      className={`transition-shadow hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="w-full max-w-6xl px-4 py-8 mx-auto md:px-6 lg:px-8">
      <Skeleton className="w-48 h-8 mb-6" />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div>
                  <Skeleton className="w-40 h-6 mb-2" />
                  <Skeleton className="w-32 h-4 mb-1" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
              <Skeleton className="w-32 h-9" />
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <Skeleton className="w-40 h-4" />
                <Skeleton className="w-12 h-4" />
              </div>
              <Skeleton className="w-full h-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Available Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-32 h-8 mb-2" />
            <Skeleton className="w-40 h-4" />
          </CardContent>
          <CardFooter className="p-0">
            <div className="grid w-full grid-cols-2">
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function TopUpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Top-Up Credits</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Enter the amount you want to top up:</p>
          <Input type="number" placeholder="Enter amount" />
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HistoryModal({
  isOpen,
  onClose,
  transactions,
  transactionType,
  setTransactionType,
  dateRange,
  setDateRange,
  handleFilterChange,
}: {
  isOpen: boolean
  onClose: () => void
  transactions: any[]
  transactionType: string
  setTransactionType: (value: string) => void
  dateRange: { start: string; end: string }
  setDateRange: (value: { start: string; end: string }) => void
  handleFilterChange: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Transaction History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <Select
              onValueChange={setTransactionType}
              value={transactionType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Top-Up">Top-Up</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Refund">Refund</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                placeholder="End Date"
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleFilterChange}
          >
            Apply Filters
          </Button>
        </div>

        <div className="overflow-auto max-h-80">
          <ul className="space-y-2">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between p-4 border rounded-md hover:bg-muted/5"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p
                      className={`text-sm font-semibold ${
                        tx.status === "Success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.status}
                    </p>
                    <p className="text-lg font-bold">
                      ₱{tx.amount.toLocaleString()}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-muted-foreground">
                No transactions match your filters
              </li>
            )}
          </ul>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

