'use client'

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { CreditCard, Package, User, Users } from 'lucide-react'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  ID: number
  user_nicename: string
  user_email: string
  display_name: string
  user_role: string
  user_level: number
  user_credits: number
  user_referral_code: string
}

export default function UserDashboardMain() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptions, setSubscriptions] = useState<any[]>([])

  const navigateToSubscription = () => {
    navigate(`/user-dashboard/${userId}/subscription-packages`)
  }

  const navigateToUserGenealogy = () => {
    navigate(`/user-dashboard/${userId}/user-genealogy`)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/${userId}`
        )
        setProfile(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch profile data")
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/invitation-code-by-user-id/${userId}`
      )
      .then((response) => {
        setSubscriptions(response.data.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [userId])

  // Mock data - replace with actual data fetching logic
  const atmTransactions = 15
  const referrals = {
    merchants: 5,
    distributors: 3,
  }

  if (loading) return <DashboardSkeleton />
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="w-full max-w-6xl px-4 py-8 mx-auto md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <Card className="overflow-hidden">
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
                  {profile?.user_role} • Level {profile?.user_level}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg font-semibold">Credits</p>
              <p className="text-3xl font-bold text-primary">
              ₱{profile?.user_credits}.00
              </p>
              {/* <p className="text-sm text-muted-foreground">
                Referral Code: {profile?.user_referral_code}
              </p> */}
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Profile Completion</p>
              <p className="text-sm font-medium">75%</p>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 mt-8 md:grid-cols-3">
        <DashboardCard
          title="ATM Transactions"
          value={atmTransactions}
          description="Total ATM transactions"
          icon={CreditCard}
        />
        <DashboardCard
          title="Activation Codes"
          value={subscriptions.length}
          description="Active subscription packages"
          icon={Package}
          onClick={navigateToSubscription}
        />
        <DashboardCard
          title="My Organization"
          value={referrals.merchants + referrals.distributors}
          description={`${referrals.merchants} merchants, ${referrals.distributors} distributors`}
          icon={Users}
          onClick={navigateToUserGenealogy}
        />
      </div>
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
      className={`transition-shadow hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
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
      <Card className="bg-white">
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
            <div className="text-center md:text-right">
              <Skeleton className="w-20 h-5 mb-2" />
              <Skeleton className="w-16 h-8 mb-1" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-12 h-4" />
            </div>
            <Skeleton className="w-full h-2" />
          </div>
        </CardContent>
        <CardFooter className="bg-muted">
          <Skeleton className="w-full h-9" />
        </CardFooter>
      </Card>

      <div className="grid gap-6 mt-8 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-12 h-8 mb-1" />
              <Skeleton className="w-32 h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

