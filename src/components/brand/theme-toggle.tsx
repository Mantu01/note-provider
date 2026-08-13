"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for mount to avoid SSR/client mismatch — both server and client
  // will agree on "dark" since defaultTheme is "dark".
  const isDark = mounted && document.documentElement.classList.contains("dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className="size-4 hidden dark:block" aria-hidden="true" />
      <Moon className="size-4 block dark:hidden" aria-hidden="true" />
    </Button>
  );
}
