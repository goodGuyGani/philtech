import { NavigationMenuDemo } from "@/components/user-navigation";
import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/complete_logo.png";
import ThemeSwitch from "@/components/theme-switcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Package, User, Users } from 'lucide-react';
import { IconUser } from "@tabler/icons-react";
import { TooltipProvider } from "@/components/ui/tooltip";


const UserDashboardLayout = () => {
  

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen flex flex-col items-center py-8">
        {/* Header Section */}
        <div className="w-full max-w-6xl flex justify-between items-center px-6 md:px-12 mb-8">
          {/* Logo */}
          <img src={Logo} alt="Logo" className="h-16 md:h-20" />
          {/* Navigation Menu and Theme Switcher */}
          <div className="flex items-center space-x-4">
            <NavigationMenuDemo />
            <ThemeSwitch />
          </div>
        </div>
        <Outlet />
      
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>&copy; 2024 PHILTECH INC. All Rights Reserved.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default UserDashboardLayout;
