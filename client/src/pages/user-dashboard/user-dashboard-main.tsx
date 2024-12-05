import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { CreditCard, Package, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams,  useNavigate } from "react-router-dom";

interface UserProfile {
  ID: number;
  user_nicename: string;
  user_email: string;
  display_name: string;
  user_role: string;
  user_level: number;
  user_credits: number;
  user_referral_code: string;
}

const UserDashboardMain = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const navigateToSubscription = () => {
    navigate(`/user-dashboard/${userId}/subscription-packages`);
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/invitation-code-by-user-id/${userId}`
      )
      .then((response) => {
        setSubscriptions(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  // Mock data - replace with actual data fetching logic
  const atmTransactions = 15;
  const subscriptionPackages = 2;
  const referrals = {
    merchants: 5,
    distributors: 3,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="w-full max-w-6xl px-6 md:px-12">
      <Card className="w-full my-8">
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
          <CardDescription>Your account details and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border p-1">
              <User className="h-20 w-20" />
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile?.display_name}</h2>
              <p className="text-sm text-muted-foreground">
                {profile?.user_email}
              </p>
              <p className="text-sm text-muted-foreground">
                Role: {profile?.user_role} | Level: {profile?.user_level}
              </p>
              <p className="text-sm text-muted-foreground">
                Credits: {profile?.user_credits} | Referral Code:{" "}
                {profile?.user_referral_code}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium">Profile Completion</p>
            <Progress value={75} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ATM Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atmTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Total ATM transactions
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={navigateToSubscription}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscription Packages
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Active subscription packages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {referrals.merchants + referrals.distributors}
            </div>
            <p className="text-xs text-muted-foreground">
              {referrals.merchants} merchants, {referrals.distributors}{" "}
              distributors
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboardMain;
