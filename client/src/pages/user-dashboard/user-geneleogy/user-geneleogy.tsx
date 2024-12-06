import React, { useState, useEffect, useCallback, useRef } from "react";
import Tree, { TreeNodeDatum, RenderCustomNodeElementFn } from "react-d3-tree";
import Draggable from "react-draggable";
import {
  ArrowDown,
  ArrowRight,
  BarChart,
  ChevronDown,
  ChevronRight,
  LineChart,
  Search,
  Settings,
  User,
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Printer,
  Store,
  CreditCard,
  X,
  Layers,
  Tag,
  Crown,
  Calendar,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSwitch from "@/components/theme-switcher";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { StatisticsPanel } from "@/pages/geneleogy/statistical-panel";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IconQuestionMark } from "@tabler/icons-react";

interface User {
  ID: number;
  display_name: string;
  user_activation_key: string;
  user_credits: number;
  user_email: string;
  user_level: number;
  user_login: string;
  user_nicename: string;
  user_pass: string;
  user_referral_code: string;
  user_referred_by_id: number | null;
  user_registered: string;
  user_role: string;
  user_status: number;
  user_upline_id: number | null;
  user_url: string;
}

interface CustomTreeNodeDatum extends TreeNodeDatum {
  id: number;
  name: string;
  role: string;
  level: number;
  uplineId: number | null;
  children?: CustomTreeNodeDatum[];
  user: User;
  x?: number;
  y?: number;
}

interface LinkData {
  source: {
    x: number;
    y: number;
  };
  target: {
    x: number;
    y: number;
  };
}

function buildHierarchy(users: User[]): CustomTreeNodeDatum {
  const idMap: any = {};
  const root: { [key: number]: CustomTreeNodeDatum } = {};

  users.forEach((user) => {
    idMap[user.ID] = {
      id: user.ID,
      name: user.display_name,
      role: user.user_role,
      level: user.user_level,
      uplineId: user.user_upline_id,
      children: [],
      user: user,
    };
  });

  users.forEach((user) => {
    if (user.user_upline_id === null) {
      root[user.ID] = idMap[user.ID];
    } else {
      const parent = idMap[user.user_upline_id];
      if (parent && parent.children) {
        parent.children.push(idMap[user.ID]);
      }
    }
  });

  return Object.values(root)[0];
}

const stepPath = (linkData: LinkData, orientation: string): string => {
  const { source, target } = linkData;
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;

  if (orientation === "vertical") {
    return `M${source.x},${source.y} V${midY} H${target.x} V${target.y}`;
  } else {
    return `M${source.y},${source.x} H${midY} V${target.x} H${target.y}`;
  }
};

const straightPath = (linkData: LinkData, orientation: string): string => {
  const { source, target } = linkData;
  if (orientation === "vertical") {
    return `M${source.x},${source.y}L${target.x},${target.y}`;
  } else {
    return `M${source.y},${source.x}L${target.y},${target.x}`;
  }
};

export default function UserGeneleogyTree() {
  const { theme, setTheme } = useTheme();
  const [treeData, setTreeData] = useState<CustomTreeNodeDatum | null>(null);
  const [data, setData] = useState<User[]>([]);
  const [translate, setTranslate] = useState({ x: 500, y: 100 });
  const [lineStyle, setLineStyle] = useState<"step" | "diagonal" | "straight">(
    "step"
  );
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical"
  );
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<CustomTreeNodeDatum | null>(
    null
  );
  const [bounds, setBounds] = useState<any | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<
    Omit<User, "ID" | "user_level" | "user_upline_id">
  >({
    display_name: "",
    user_activation_key: "",
    user_credits: 0,
    user_email: "",
    user_login: "",
    user_nicename: "",
    user_pass: "",
    user_referral_code: "",
    user_referred_by_id: null,
    user_registered: new Date().toISOString(),
    user_role: "distributor",
    user_status: 0,
    user_url: "",
  });
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<CustomTreeNodeDatum[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<CustomTreeNodeDatum | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);

  const clampZoom = (value: number) => Math.min(Math.max(value, 0.1), 2);

  const form = useForm({
    defaultValues: {
      display_name: "",
      user_email: "",
      user_role: "",
      referral_code: "",
    },
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateBounds = useCallback(() => {
    const container = treeContainerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const scaledWidth = containerWidth / zoom;
    const scaledHeight = containerHeight / zoom;

    const maxX = (scaledWidth - containerWidth) / 2;
    const maxY = (scaledHeight - containerHeight) / 2;

    setBounds({
      left: -maxX,
      right: maxX,
      top: -maxY,
      bottom: maxY,
    });
  }, [zoom]);

  useEffect(() => {
    if (data.length > 0) {
      const hierarchicalData = buildHierarchy(data);
      setTreeData(hierarchicalData);
    }
  }, [data]);

  useEffect(() => {
    calculateBounds();
  }, [zoom, calculateBounds]);

  useEffect(() => {
    window.addEventListener("resize", calculateBounds);
    return () => window.removeEventListener("resize", calculateBounds);
  }, [calculateBounds]);

  const renderCustomNodeElement: RenderCustomNodeElementFn = ({
    nodeDatum,
    toggleNode,
  }) => {
    const customNodeDatum = nodeDatum as CustomTreeNodeDatum;
    return (
      <g>
        <circle
          r={20}
          fill={
            customNodeDatum.role === "master"
              ? "#4CAF50"
              : customNodeDatum.role === "distributor"
              ? "#2196F3"
              : "#FFC107"
          }
          onClick={() => {
            setSelectedNode(customNodeDatum);
            setIsUserInfoDialogOpen(true); // Updated onClick handler
          }}
          onMouseEnter={(event) =>
            setHoveredNode({ ...customNodeDatum, event })
          }
          onMouseLeave={() => setHoveredNode(null)}
          className="cursor-pointer transition-all duration-300 hover:opacity-80"
        />
        <foreignObject
          x={orientation === "vertical" ? "25" : "-100"}
          y={orientation === "vertical" ? "-10" : "25"}
          width="200"
          height="40"
        >
          <div
            className={`text-sm font-medium font-primary ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            } ${orientation === "horizontal" ? "text-center" : ""} truncate`}
          >
            {customNodeDatum.name}
          </div>
        </foreignObject>
        {customNodeDatum.children && customNodeDatum.children.length > 0 && (
          <g
            onClick={toggleNode}
            className="cursor-pointer transition-all duration-300 hover:opacity-80"
            transform={`translate(${orientation === "vertical" ? 25 : 0}, ${
              orientation === "vertical" ? -25 : -25
            })`}
          >
            <circle r={10} fill="lightgray" stroke="black" strokeWidth="1" />
            <text
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize="10"
              fontWeight="bold"
            >
              {customNodeDatum.__rd3t.collapsed ? "▶" : "▼"}
            </text>
          </g>
        )}
      </g>
    );
  };

  const getPathFunction = () => {
    switch (lineStyle) {
      case "step":
        return (linkData: LinkData) => stepPath(linkData, orientation);
      case "diagonal":
        return "diagonal";
      case "straight":
        return (linkData: LinkData) => straightPath(linkData, orientation);
      default:
        return (linkData: LinkData) => stepPath(linkData, orientation);
    }
  };

  const handleSearch = useCallback(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const results = searchUsers(searchTerm);
    setSearchResults(results);
    console.log("Search results:", results);
  }, [searchTerm]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    } else if (event.key === 'Escape') {
      setSearchResults([]);
    }
  }, [handleSearch]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const searchUsers = (term: string): CustomTreeNodeDatum[] => {
    const searchTermLower = term.toLowerCase();
    const queue: CustomTreeNodeDatum[] = [treeData as CustomTreeNodeDatum];
    const results: CustomTreeNodeDatum[] = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        if (
          node.name.toLowerCase().includes(searchTermLower) ||
          node.user.user_email.toLowerCase().includes(searchTermLower) ||
          node.user.user_login.toLowerCase().includes(searchTermLower)
        ) {
          results.push(node);
        }
        if (node.children) {
          queue.push(...node.children);
        }
      }
    }

    return results;
  };

  const handleSelectSearchResult = (result: any) => {
    setSelectedNode(result);
    setIsUserInfoDialogOpen(true); // Updated handleSelectSearchResult
  };

  const handleAddUser = async () => {
    try {
      const uplineUser = data.find(
        (user) => user.user_referral_code === referralCode
      );
      if (!uplineUser) {
        console.error("Invalid referral code");
        return;
      }

      const newUserLevel = uplineUser.user_level + 1;

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/add-user`,
        {
          ...newUser,
          user_upline_id: uplineUser.ID,
          user_referred_by_id: uplineUser.ID,
          user_level: newUserLevel,
        }
      );

      setData((prevData) => [...prevData, response.data]);
      setIsAddUserDialogOpen(false);
      setNewUser({
        display_name: "",
        user_activation_key: "",
        user_credits: 0,
        user_email: "",
        user_login: "",
        user_nicename: "",
        user_pass: "",
        user_referral_code: "",
        user_referred_by_id: null,
        user_registered: new Date().toISOString(),
        user_role: "distributor",
        user_status: 0,
        user_url: "",
      });
      setReferralCode("");
      setMatchedUser(null);
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  };

  const handleReferralCodeChange = (code: string) => {
    setReferralCode(code);
    setIsLoading(true);

    const matchedUser = data.find((user) => user.user_referral_code === code);

    if (matchedUser) {
      setMatchedUser(matchedUser);
    } else {
      setMatchedUser(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (treeData) {
      setTreeData((prevData: any) => ({ ...prevData }));
    }
  }, [translate]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => clampZoom(prevZoom + 0.1));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => clampZoom(prevZoom - 0.1));
  };

  const handleResetView = () => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleExportImage = async () => {
    const element = treeContainerRef.current;
    if (element) {
      const canvas = await html2canvas(element);
      canvas.toBlob((blob: any) => {
        if (blob) {
          saveAs(blob, 'genealogy-tree.png');
        }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-screen overflow-hidden relative flex max-w-6xl flex-col border">
      <header className="flex h-16 items-center justify-between gap-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Report</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Genealogy Tree</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-64 pr-8"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={handleSearch}
              type="submit"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tree Settings</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Tree Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <LineChart className="mr-2 h-4 w-4" />
                      <span>Line Style</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setLineStyle("step")}>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          <span>Step</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setLineStyle("diagonal")}
                        >
                          <ArrowDown className="mr-2 h-4 w-4 rotate-45" />
                          <span>Diagonal</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setLineStyle("straight")}
                        >
                          <ArrowDown className="mr-2 h-4 w-4" />
                          <span>Straight</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>Orientation</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => setOrientation("vertical")}
                        >
                          <ArrowDown className="mr-2 h-4 w-4" />
                          <span>Vertical</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOrientation("horizontal")}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          <span>Horizontal</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <ThemeSwitch />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Theme</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {showStatistics && (
          <div className="w-full p-4 bg-background border-r overflow-y-auto">
            <StatisticsPanel users={data} />
          </div>
        )}
        <div
          ref={treeContainerRef}
          className="relative flex-1 h-full overflow-hidden"
        >
          <Draggable bounds={bounds}>
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: "100%",
                height: "100%",
              }}
              className="transition-transform"
            >
              {treeData && (
                <Tree
                  data={treeData}
                  orientation={orientation}
                  renderCustomNodeElement={renderCustomNodeElement}
                  translate={translate}
                  separation={{
                    siblings: orientation === "horizontal" ? 1.5 : 2,
                    nonSiblings: 2,
                  }}
                  zoomable={true}
                  nodeSize={
                    orientation === "horizontal"
                      ? { x: 150, y: 300 }
                      : { x: 200, y: 100 }
                  }
                  pathFunc={getPathFunction()}
                  transitionDuration={300}
                  zoom={zoom}
                />
              )}
            </div>
          </Draggable>
        </div>
        {hoveredNode && (
          <div
            className="fixed p-4 bg-background border rounded-lg shadow-lg z-50 transition-opacity duration-300"
            style={{
              left: `${hoveredNode.event?.clientX ?? 0}px`,
              top: `${hoveredNode.event?.clientY ?? 0}px`,
              opacity: hoveredNode ? 1 : 0,
            }}
          >
            <p>
              <strong>Name:</strong> {hoveredNode.name}
            </p>
            <p>
              <strong>Role:</strong> {hoveredNode.role}
            </p>
            <p>
              <strong>Level:</strong> {hoveredNode.level}
            </p>
          </div>
        )}
      </div>
      <Dialog open={isUserInfoDialogOpen} onOpenChange={setIsUserInfoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">User Information</DialogTitle>
            <DialogDescription>Details about the selected user in the genealogy tree.</DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedNode.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedNode.user.user_email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    {selectedNode.user.user_role === "master" && <Crown className="h-4 w-4 text-yellow-500" />}
                    {selectedNode.user.user_role === "distributor" && <Users className="h-4 w-4 text-blue-500" />}
                    {selectedNode.user.user_role === "merchant" && <Store className="h-4 w-4 text-green-500" />}
                    {selectedNode.user.user_role === null && <IconQuestionMark className="h-4 w-4 text-green-500" />}
                    <span className="capitalize">{selectedNode.user.user_role}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Level</Label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span>{selectedNode.level}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Referral Code</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>{selectedNode.user.user_referral_code}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Credits</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>{selectedNode.user.user_credits}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Registered On</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(selectedNode.user.user_registered).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserInfoDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details of the new user to add to the hierarchy.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="merchant">Merchant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referral_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleReferralCodeChange(e.target.value);
                      }}
                      placeholder="Enter upline user's referral code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Searching for user...
              </p>
            )}
            {matchedUser && (
              <div className="space-y-2">
                <Label htmlFor="matchedUser">Upline User</Label>
                <Input
                  id="matchedUser"
                  value={`${matchedUser.display_name} (ID: ${matchedUser.ID})`}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      </Dialog>
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user to add to the hierarchy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.display_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, display_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.user_email}
                onChange={(e) =>
                  setNewUser({ ...newUser, user_email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.user_role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, user_role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                value={referralCode}
                onChange={(e) => handleReferralCodeChange(e.target.value)}
                placeholder="Enter upline user's referral code"
              />
              {isLoading && (
                <p className="text-sm text-muted-foreground">
                  Searching for user...
                </p>
              )}
              {matchedUser && (
                <div className="mt-2 space-y-2">
                  <Label htmlFor="matchedUser">Upline User</Label>
                  <Input
                    id="matchedUser"
                    value={`${matchedUser.display_name} (ID: ${matchedUser.ID})`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
              {matchedUser && (
                <div className="space-y-2">
                  <Label htmlFor="uplineUserId">Upline User ID</Label>
                  <Input
                    id="uplineUserId"
                    value={matchedUser.ID.toString()}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/80 backdrop-blur p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddUserDialogOpen(true)}
          >
            <User className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Manage Teams
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatistics(!showStatistics)}
          >
            <BarChart className="h-4 w-4 mr-2" />
            {showStatistics ? 'Hide' : 'Show'} Statistics
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportImage}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            {isFullscreen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
      {searchResults.length > 0 && (
        <Card className="absolute top-20 left-4 w-64 bg-background/80 backdrop-blur p-2 rounded-lg max-h-96 overflow-y-auto">
          <div className="flex flex-row items-center justify-between mb-2">
            <h3 className="font-semibold">Search Results</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchResults([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="cursor-pointer hover:bg-accent rounded-md p-2"
                onClick={() => handleSelectSearchResult(result)}
              >
                <p className="font-medium">{result.name}</p>
                <p className="text-sm text-muted-foreground">
                  {result.user.user_email}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

