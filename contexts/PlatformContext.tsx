"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Platform = "mac" | "windows" | "linux" | "wsl";

export const PLATFORMS: Record<Platform, { label: string; icon: string; description: string }> = {
  mac: { label: "macOS", icon: "🍎", description: "Apple macOS" },
  windows: { label: "Windows", icon: "🪟", description: "Microsoft Windows" },
  linux: { label: "Linux", icon: "🐧", description: "Linux (Ubuntu, Debian, etc.)" },
  wsl: { label: "WSL", icon: "🔷", description: "Windows Subsystem for Linux" },
};

interface PlatformContextType {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  isLoaded: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatformState] = useState<Platform>("mac");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem("user-platform") as Platform | null;

    if (stored && Object.keys(PLATFORMS).includes(stored)) {
      setPlatformState(stored);
    } else {
      // Auto-detect platform
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("win")) {
        setPlatformState("windows");
      } else if (userAgent.includes("mac")) {
        setPlatformState("mac");
      } else if (userAgent.includes("linux")) {
        setPlatformState("linux");
      }
    }

    setIsLoaded(true);
  }, []);

  const setPlatform = (newPlatform: Platform) => {
    setPlatformState(newPlatform);
    localStorage.setItem("user-platform", newPlatform);
  };

  return (
    <PlatformContext.Provider value={{ platform, setPlatform, isLoaded }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
}
