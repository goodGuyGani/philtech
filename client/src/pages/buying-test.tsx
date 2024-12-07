import React, { useState } from "react";
import axios from "axios";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ThemeSwitch from "@/components/theme-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Tv, Satellite } from 'lucide-react';

const BuyingTest = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [stocks, setStocks] = useState(1);
  const [currentVoucher, setCurrentVoucher] = useState("GSAT Voucher");

  const users = [
    { id: 1, name: "Arnold" },
    { id: 2, name: "Distributor A" },
    { id: 3, name: "Distributor D" },
  ];

  const products = ["FG99", "G500"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser || !selectedProduct || !email || stocks <= 0) {
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
        user_id: parseInt(selectedUser, 10),
        product_code: selectedProduct,
        email: email,
        stocks,
      };

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
    <div className="max-w-screen min-h-screen bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mx-2 h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:inline-flex">
                <BreadcrumbLink href="#">Voucher</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:inline-flex" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentVoucher}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ThemeSwitch />
      </header>
      
      <main className="container mx-auto py-6">
        <Tabs defaultValue="gsat" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="gsat" onClick={() => setCurrentVoucher("GSAT Voucher")} className="flex items-center justify-center gap-2">
              <Satellite className="w-4 h-4" />
              GSAT
            </TabsTrigger>
            <TabsTrigger value="wifi" onClick={() => setCurrentVoucher("WiFi Voucher")} className="flex items-center justify-center gap-2">
              <Wifi className="w-4 h-4" />
              WiFi
            </TabsTrigger>
            <TabsTrigger value="tv" onClick={() => setCurrentVoucher("TV Voucher")} className="flex items-center justify-center gap-2">
              <Tv className="w-4 h-4" />
              TV
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gsat">
            <div>
              <CardHeader>
                <CardTitle>Purchase GSAT Voucher</CardTitle>
                <CardDescription>Fill out the form below to purchase a GSAT voucher.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
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
                  </div>

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
                  <Input id="password" type="password" placeholder="Enter WiFi password" />
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
        </Tabs>
      </main>
    </div>
  );
};

export default BuyingTest;

