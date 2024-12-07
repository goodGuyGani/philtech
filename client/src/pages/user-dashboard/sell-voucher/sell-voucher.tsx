import React, { useState } from "react";
import axios from "axios";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Tv, Satellite, Phone, CreditCard, PhilippinePeso } from "lucide-react";
import { useParams } from "react-router-dom";

const SellVoucher = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [stocks, setStocks] = useState(1);
  const [, setCurrentVoucher] = useState("GSAT Voucher");
  const userId = useParams().userId;

  const products = ["FG99", "G500"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProduct || !email || stocks <= 0) {
      toast({
        title: "Error",
        description:
          "Please fill out all fields and ensure stocks are greater than 0!",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestData = {
        user_id: userId,
        product_code: selectedProduct,
        email: email,
        stocks,
      };

      console.log(requestData);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/buy-gsat-voucher`,
        requestData
      );

      if (response.data) {
        toast({
          title: "Success",
          description: "Voucher successfully assigned!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to assign voucher. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error buying voucher:", error);
      toast({
        title: "Error",
        description: "An error occurred while assigning the voucher.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen max-w-5xl w-full bg-background">
      <Separator className="" />
      <p className="text-3xl font-bold mt-6">Sell Voucher</p>
      <p className="text-muted-foreground mt-2">
        Configure and manage to Sell Voucher details and communication settings.
      </p>

      <main className="container mx-auto py-6">
        <Tabs defaultValue="gsat" className="w-full">
        <TabsList className="grid w-full mx-auto grid-cols-6 mb-6">
            <TabsTrigger
              value="gsat"
              onClick={() => setCurrentVoucher("GSAT Voucher")}
              className="flex items-center justify-center gap-2"
            >
              <Satellite className="w-4 h-4" />
              GSAT
            </TabsTrigger>
            <TabsTrigger
              value="wifi"
              onClick={() => setCurrentVoucher("WiFi Voucher")}
              className="flex items-center justify-center gap-2"
            >
              <Wifi className="w-4 h-4" />
              WiFi
            </TabsTrigger>
            <TabsTrigger
              value="tv"
              onClick={() => setCurrentVoucher("TV Voucher")}
              className="flex items-center justify-center gap-2"
            >
              <Tv className="w-4 h-4" />
              TV
            </TabsTrigger>
            <TabsTrigger
              value="telco"
              onClick={() => setCurrentVoucher("Telco Voucher")}
              className="flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Telco
            </TabsTrigger>
            <TabsTrigger
              value="bills"
              onClick={() => setCurrentVoucher("Bills Payment")}
              className="flex items-center justify-center gap-2"
            >
              <PhilippinePeso className="w-4 h-4" />
              Bills
            </TabsTrigger>
            <TabsTrigger
              value="cashIn"
              onClick={() => setCurrentVoucher("Cash-in")}
              className="flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Cash-in
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gsat">
            <div>
              <CardHeader>
                <CardTitle>Purchase GSAT Voucher</CardTitle>
                <CardDescription>
                  Fill out the form below to purchase a GSAT voucher.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* <div className="space-y-2">
                    <Label htmlFor="user">Select User</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger id="user">
                        <SelectValue placeholder="Select a User" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="product">Select Product</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select a Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stocks">Enter Number of Stocks</Label>
                    <Input
                      type="number"
                      id="stocks"
                      value={stocks}
                      onChange={(e) => setStocks(Number(e.target.value))}
                      min="1"
                      placeholder="Enter stock quantity"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Enter Your Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Enter Your Email</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </CardContent>
            </div>
          </TabsContent>
          <TabsContent value="wifi">
            <div>
              <CardHeader>
                <CardTitle>WiFi Voucher Management</CardTitle>
                <CardDescription>
                  Manage your WiFi vouchers and settings here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ssid">WiFi SSID</Label>
                  <Input id="ssid" placeholder="Enter WiFi SSID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">WiFi Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter WiFi password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Voucher Duration</Label>
                  <Select>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                      <SelectItem value="30d">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Generate WiFi Voucher</Button>
              </CardFooter>
            </div>
          </TabsContent>
          <TabsContent value="tv">
            <div>
              <CardHeader>
                <CardTitle>TV Subscription Management</CardTitle>
                <CardDescription>
                  Manage your TV subscriptions and packages here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="package">TV Package</Label>
                  <Select>
                    <SelectTrigger id="package">
                      <SelectValue placeholder="Select TV package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Package</SelectItem>
                      <SelectItem value="standard">Standard Package</SelectItem>
                      <SelectItem value="premium">Premium Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Subscription Duration</Label>
                  <Select>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Month</SelectItem>
                      <SelectItem value="3m">3 Months</SelectItem>
                      <SelectItem value="6m">6 Months</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addons">Add-ons</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">Sports</Button>
                    <Button variant="outline">Movies</Button>
                    <Button variant="outline">Kids</Button>
                    <Button variant="outline">News</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe to TV Package</Button>
              </CardFooter>
            </div>
          </TabsContent>
          <TabsContent value="telco">
            <div>
              <CardHeader>
                <CardTitle>Telco E-load Subscription Management</CardTitle>
                <CardDescription>
                  Manage your Telco E-load subscriptions and packages here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col justify-center items-center">
              <h1 className="text-4xl mt-10">Coming soon..</h1>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </div>
          </TabsContent>
          <TabsContent value="bills">
            <div>
              <CardHeader>
                <CardTitle>Bills Payment Management</CardTitle>
                <CardDescription>
                  Manage your bill payment and packages here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col justify-center items-center">
                <h1 className="text-4xl mt-10">Coming soon..</h1>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </div>
          </TabsContent>
          <TabsContent value="cashIn">
            <div>
              <CardHeader>
                <CardTitle>Cash-in Management</CardTitle>
                <CardDescription>
                  Manage your cash-in payment and packages here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col justify-center items-center">
                <h1 className="text-4xl mt-10">Coming soon..</h1>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SellVoucher;
