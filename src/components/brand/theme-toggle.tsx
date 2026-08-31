"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border border-border/80 bg-card/80"
    >
      <Sun aria-hidden="true" className={isDark ? "block size-4" : "hidden size-4"} />
      <Moon aria-hidden="true" className={isDark ? "hidden size-4" : "block size-4"} />
    </Button>
  );
}
