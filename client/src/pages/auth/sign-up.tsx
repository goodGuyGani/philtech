import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/pt-logo.png";
import ThemeSwitch from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import useAxiosInstance from "@/lib/axios-instance";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";

interface UserData {
  user_login: string;
  user_pass: string;
  user_nicename: string;
  user_email: string;
  user_role: string;
  user_credits: string;
  user_referral_code: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [showReferralCode, setShowReferralCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserData>({
    user_login: "",
    user_pass: "",
    user_nicename: "",
    user_email: "",
    user_role: "",
    user_credits: "",
    user_referral_code: "",
  });

  const onChangeRecaptcha = () => {
    setIsRecaptchaVerified(true);
  };

  const fetchUplineUserDetails = async (referralCode: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/invitation-code/${referralCode}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching referral code owner:", error);
      return null;
    }
  };

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let userDataToSubmit: UserData & {
        user_upline_id?: number;
        user_referred_by_id?: number;
        user_level?: number;
      } = { ...data };

      if (data.user_referral_code) {
        const uplineUserDetails = await fetchUplineUserDetails(
          data.user_referral_code
        );
        if (!uplineUserDetails) {
          toast({
            title: "Error",
            description: "Invalid referral code. Please check and try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        userDataToSubmit = {
          ...userDataToSubmit,
          user_upline_id: uplineUserDetails.user_id,
          user_referred_by_id: uplineUserDetails.user_id,
          user_level: uplineUserDetails.user_level + 1,
        };
      }

      // Make the POST request
      const response = await axiosInstance.post(
        "/api/register-users",
        userDataToSubmit
      );

      // Extract the registered user ID
      const userId = response.data.ID;
      console.log(userId);
      // Success toast and navigation
      toast({
        title: "Success",
        description: "Registration Successful",
      });
      navigate(`/`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );
        toast({
          title: "Failed",
          description: error.response?.data?.message || "Error Registering",
          variant: "destructive",
        });
      } else {
        console.error("Registration failed:", (error as Error).message);
        toast({
          title: "Failed",
          description: "Error Registering",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              className="h-24 w-24 object-cover rounded-full"
              src={Logo}
              alt="Example Logo"
            />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign up to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerUser} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="user_login">Username</Label>
                <Input
                  value={data.user_login}
                  onChange={(e) =>
                    setData({ ...data, user_login: e.target.value })
                  }
                  type="text"
                  id="user_login"
                  placeholder="Enter your username..."
                  required
                  aria-label="Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_email">Email</Label>
                <Input
                  value={data.user_email}
                  onChange={(e) =>
                    setData({ ...data, user_email: e.target.value })
                  }
                  type="email"
                  id="user_email"
                  placeholder="Enter your email..."
                  required
                  aria-label="Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_pass">Password</Label>
                <Input
                  value={data.user_pass}
                  onChange={(e) =>
                    setData({ ...data, user_pass: e.target.value })
                  }
                  type="password"
                  id="user_pass"
                  placeholder="Enter your password..."
                  required
                  aria-label="Password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_nicename">Nickname</Label>
                <Input
                  value={data.user_nicename}
                  onChange={(e) =>
                    setData({ ...data, user_nicename: e.target.value })
                  }
                  type="text"
                  id="user_nicename"
                  placeholder="Enter your nickname..."
                  aria-label="Nickname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_role">Role</Label>
                <Select
                  value={data.user_role}
                  onValueChange={(value) =>
                    setData({ ...data, user_role: value })
                  }
                >
                  <SelectTrigger aria-label="Select role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merchant">Merchant</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_credits">Credits</Label>
                <Input
                  value={data.user_credits}
                  onChange={(e) =>
                    setData({ ...data, user_credits: e.target.value })
                  }
                  type="number"
                  step="0.01"
                  id="user_credits"
                  placeholder="Enter user credits..."
                  aria-label="Credits"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="referralCodeCheckbox"
                checked={showReferralCode}
                onCheckedChange={(checked) =>
                  setShowReferralCode(checked as boolean)
                }
              />
              <Label htmlFor="referralCodeCheckbox">
                Do you have a referral code?
              </Label>
            </div>
            {showReferralCode && (
              <div className="space-y-2">
                <Label htmlFor="user_referral_code">Referral Code</Label>
                <Input
                  value={data.user_referral_code}
                  onChange={(e) =>
                    setData({ ...data, user_referral_code: e.target.value })
                  }
                  type="text"
                  id="user_referral_code"
                  placeholder="Enter referral code..."
                  aria-label="Referral Code"
                />
              </div>
            )}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6Ld3WR8qAAAAACypib4Kd6zhUPJj16Aghyz6Q7kK"
                onChange={onChangeRecaptcha}
              />
            </div>
            <Button
              disabled={!isRecaptchaVerified || isLoading}
              type="submit"
              className="w-full flex justify-center items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin text-white" size={24} />
                  <span>Signing Up...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-muted-foreground">
              Already have an account?
            </span>
            <Link to="/">
              <Button variant="link" className="ml-2">
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default SignUp;
