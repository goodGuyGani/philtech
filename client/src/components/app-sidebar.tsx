import * as React from "react";
import {
  AudioWaveform,
  Book,
  Bot,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Ticket,
  Wallet,
  Users,
  TerminalSquare,
} from "lucide-react";

import { IconSitemap } from "@tabler/icons-react";

import { IconReport } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sample data with updated icons
const data = {
  user: {
    name: "Admin",
    email: "admin@philtech.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: TerminalSquare,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: DollarSign,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: AudioWaveform,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
