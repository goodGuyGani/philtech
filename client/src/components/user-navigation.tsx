"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { IconLabel } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "@/hooks/use-user"; // Import the user context

export function NavigationMenuDemo() {
  const navigate = useNavigate();
  const userId = useParams().userId;

  const components = [
    {
      title: "Sell Vouchers",
      path: `/user-dashboard/${userId}/sell-voucher`,
      description:
        "Facilitate the selling of various vouchers through a streamlined interface.",
    },
    {
      title: "Sold Vouchers",
      path: `/user-dashboard/${userId}/sold-voucher`,
      description:
        "View details of vouchers that have already been sold, including transaction information.",
    },
  ];

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Navigate to a given route when a navigation item is clicked.
   * @param {string} path - The route path to navigate to.
   */
/******  458a0b5e-3dda-445b-8aa1-71f7b87c266a  *******/  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const { clearUser } = useUserContext()

  const handleLogout = () => {
    clearUser() // Clear user data and token
    navigate("/") // Redirect to the login page
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Navigation</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md"
                    style={{ backgroundColor: "#3372B7" }}
                    onClick={() => handleNavigation("/")}
                  >
                    <IconLabel className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Dashboard
                    </div>
                    <p className="text-sm leading-tight text-primary">
                      Manage your Sales and Earning and configure your Account.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                className="cursor-pointer"
                title="Dashboard"
                onClick={() => handleNavigation(`/user-dashboard/${userId}`)}
              >
                Overview of the app's main features and navigation options.
              </ListItem>

              <ListItem
                title="Genealogy"
                onClick={() => handleNavigation(`/user-dashboard/${userId}/user-geneleogy`)}
              >
                A guide to installing dependencies and setting up the app's file
                structure.
              </ListItem>

              <ListItem
                title="Report"
                onClick={() => handleNavigation("/docs/primitives/typography")}
              >
                Information on typography styles, including headings,
                paragraphs, and lists.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Vouchers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  className="cursor-pointer"
                  key={component.title}
                  title={component.title}
                  onClick={() => handleNavigation(component.path)}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="cursor-pointer">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            onClick={() => handleNavigation(`/user-dashboard/${userId}/store`)}
          >
            Store
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="cursor-pointer">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            onClick={() => handleNavigation("/vouchers")}
          >
            Settings
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* Logout Item */}
        <NavigationMenuItem className="cursor-pointer">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            onClick={handleLogout}
          >
            Log Out
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { onClick: () => void }
>(({ className, title, children, onClick, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          onClick={onClick}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
