"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Blocks,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "3.05rem" },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  return (
    <motion.div
      className="sidebar fixed left-0 z-40 h-full shrink-0 border-r"
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-40 flex h-full shrink-0 flex-col bg-white text-muted-foreground dark:bg-black"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            {/* HEADER */}
            <div className="flex h-[54px] w-full border-b p-2">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 px-2">
                    <Avatar className="size-4 rounded">
                      <AvatarFallback>O</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <>
                        <p className="text-sm font-medium">Organization</p>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/settings/members" className="flex gap-2">
                      <UserCog className="h-4 w-4" /> Manage members
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/integrations" className="flex gap-2">
                      <Blocks className="h-4 w-4" /> Integrations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/select-org" className="flex gap-2">
                      <Plus className="h-4 w-4" /> Create or join organization
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* MENU */}
            <ScrollArea className="grow p-2">
              <nav className="flex flex-col gap-1">
                {[
                  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { href: "/reports", label: "Reports", icon: FileClock },
                  { href: "/chat", label: "Chat", icon: MessagesSquare, badge: "BETA" },
                  { href: "/deals", label: "Deals", icon: Layout },
                  { href: "/accounts", label: "Accounts", icon: UserCircle },
                  { href: "/competitors", label: "Competitors", icon: UserSearch },
                  { href: "/library/knowledge", label: "Knowledge Base", icon: GraduationCap },
                  { href: "/feedback", label: "Feedback", icon: MessageSquareText },
                  { href: "/review", label: "Document Review", icon: FileClock },
                ].map(({ href, label, icon: Icon, badge }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex h-8 items-center rounded-md px-2 py-1.5 transition hover:bg-muted",
                      pathname?.includes(href.split("/")[1]) &&
                        "bg-muted text-blue-600"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <div className="ml-2 flex items-center gap-2">
                        <span className="text-sm font-medium">{label}</span>
                        {badge && (
                          <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-700 dark:text-blue-300">
                            {badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </nav>
            </ScrollArea>

            {/* FOOTER */}
            <div className="p-2">
              <Link
                href="/settings/profile"
                className="flex h-8 items-center rounded-md px-2 hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2 text-sm">Settings</span>}
              </Link>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="w-full">
                  <div className="flex h-8 items-center gap-2 rounded-md px-2 hover:bg-muted">
                    <Avatar className="size-4">
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <>
                        <span className="text-sm">Account</span>
                        <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                      </>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <UserCircle className="h-4 w-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
