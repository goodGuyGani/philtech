import * as React from "react";
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Ticket,
  Wallet,
  Users,
} from "lucide-react";
import { IconSitemap } from "@tabler/icons-react";
import { IconReport } from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/hooks/use-user";

// Sample data with updated icons
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Wallet,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Distributor",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Distributors",
          url: "#",
        },
        {
          title: "Verified Distributors",
          url: "#",
        },
      ],
    },
    {
      title: "Merchant",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "All Merchants",
          url: "#",
        },
        {
          title: "Verified Merchants",
          url: "#",
        },
      ],
    },
    {
      title: "Voucher",
      url: "#",
      icon: Ticket,
      items: [
        {
          title: "TV Vouchers",
          url: "/dashboard/tv-voucher",
        },
        {
          title: "WiFi Vouchers",
          url: "/dashboard/wifi-voucher",
        },
        {
          title: "GSAT Vouchers",
          url: "/dashboard/gsat-voucher",
        },
      ],
    },
    {
      title: "Report",
      url: "#",
      icon: IconReport,
      items: [
        {
          title: "ATM Reports",
          url: "/dashboard/atm-report",
        },
      ],
    },
    {
      title: "Genealogy",
      url: "/dashboard/genealogy-tree",
      icon: IconSitemap,
      isActive: true,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserContext(); // Accessing the user from context
console.log(user);
  // Dynamically set user data based on context
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default-avatar.png", // If avatar is not available, use a default one
  } : {
    name: "Guest",
    email: "guest@example.com",
    avatar: "/avatars/default-avatar.png",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
