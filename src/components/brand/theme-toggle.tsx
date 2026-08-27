"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Read theme only after mount to avoid SSR/CSR mismatch
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

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
