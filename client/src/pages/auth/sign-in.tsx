import { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "@/hooks/use-user";
import { useNavigate, Link } from "react-router-dom";
import Logo from "@/assets/pt-logo.png";
import ThemeSwitch from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import useAxiosInstance from "@/lib/axios-instance";
import ReCAPTCHA from "react-google-recaptcha";

const SignIn = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const { user, setUser, setToken } = useUserContext();
  const [isRecaptchaVerified, setIsReCaptchaVerified] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "merchant" || user.role === "distributor") {
        navigate(`/user-dashboard/${user.id}`);
      }
    }
  }, [user, navigate]);

  const onChangeRecaptcha = () => {
    setIsReCaptchaVerified(true);
  };

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });
      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "merchant" || user.role === "distributor") {
        navigate(`/user-dashboard/${user.id}`);
      } else {
        toast({
          title: "Access Denied",
          description: "You do not have the correct permissions to log in.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Login Successful",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login failed:", error.response?.data || error.message);
        toast({
          title: "Failed",
          description: "Incorrect Email and Password",
          variant: "destructive",
        });
      } else {
        console.error("Login failed:", (error as Error).message);
        toast({
          title: "Failed",
          description: "Error Logging In",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="container max-w-none flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[400px] flex-col items-center justify-center gap-5 pt-12 pr-12 pl-12">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              className="h-45 flex-none object-cover [clip-path:circle()]"
              src={Logo}
              alt="Example Logo"
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="font-extrabold text-2xl">Welcome</span>
              <span className="text-muted-foreground">
                Login or sign up below
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-3">
            <Separator />
          </div>
          <div className="flex flex-col items-center justify-center self-start ">
            <span className="font-bold text-2xl self-start">Login</span>
            <span className="text-muted-foreground text-sm self-start">
              Enter your email below to login.
            </span>
          </div>
          <form onSubmit={loginUser} className="w-76">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="email"
                id="email"
                placeholder="Enter your Email..."
              />
              <Label htmlFor="password">Password</Label>
              <Input
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                type="password"
                id="password"
                placeholder="Enter your Password..."
              />
            </div>
            <div className="mt-3">
              <ReCAPTCHA
                sitekey="6Ld3WR8qAAAAACypib4Kd6zhUPJj16Aghyz6Q7kK"
                onChange={onChangeRecaptcha}
              />
            </div>
            <Button
              disabled={!isRecaptchaVerified}
              type="submit"
              className="w-full bg-foreground mt-4"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-muted-foreground">Don't have an account?</span>
            <Link to="/sign-up">
              <Button variant="link" className="ml-2">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
