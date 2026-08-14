"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Loading theme" disabled className="border border-border/80 bg-card/80">
        <Sun aria-hidden="true" className="hidden size-4" />
        <Moon aria-hidden="true" className="block size-4" />
      </Button>
    );
  }

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
