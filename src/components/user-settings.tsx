"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GearIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import EditUsernameForm from "./edit-username-form";
import PullModel from "./pull-model";
import useChatStore from "@/app/hooks/useChatStore";

export default function UserSettings() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const userName = localStorage.getItem("ollama_user") || "User";
  // Function to cycle through themes
  const toggleTheme = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  // Get current theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="size-4" />;
      case "dark":
        return <Moon className="size-4" />;
      default:
        return <Monitor className="size-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex justify-start gap-3 w-full h-14 text-base font-normal items-center"
        >
          <Avatar className="flex justify-start items-center overflow-hidden">
            <AvatarImage
              src=""
              alt="AI"
              width={4}
              height={4}
              className="object-contain"
            />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs truncate">
            <p>{userName}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2">

        {/* Theme Toggle Button */}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 p-1"
            onClick={toggleTheme}
          >
            {getThemeIcon()}
            <span>
              {theme === "system" ? "Системный" : 
               theme === "light" ? "Светлый" : "Тёмный"}
            </span>
          </Button>
        </DropdownMenuItem>

        {/* Profile Dialog */}
        {/* <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-full">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                <AvatarIcon className="w-4 h-4" />
                Профиль
              </div>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-4">
              <DialogTitle>Профиль</DialogTitle>
              <EditUsernameForm setOpen={setOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}