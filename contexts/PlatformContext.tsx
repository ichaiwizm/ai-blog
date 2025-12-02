"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Platform = "mac" | "windows" | "linux" | "wsl";

export const PLATFORMS: Record<Platform, { label: string; icon: ReactNode; description: string }> = {
  mac: {
    label: "macOS",
    icon: <AppleIcon />,
    description: "Apple macOS"
  },
  windows: {
    label: "Windows",
    icon: <WindowsIcon />,
    description: "Microsoft Windows"
  },
  linux: {
    label: "Linux",
    icon: <LinuxIcon />,
    description: "Linux (Ubuntu, Debian, etc.)"
  },
  wsl: {
    label: "WSL",
    icon: <TerminalIcon />,
    description: "Windows Subsystem for Linux"
  },
};

// Platform Icons - Clean, centered SVG designs
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="inline-block align-middle">
      <path d="M11.182 4.87c-.627.752-.994 1.696-.994 2.71 0 1.296.587 2.457 1.508 3.231-.283.75-.644 1.458-1.086 2.12-.627.938-1.276 1.876-2.301 1.893-1.009.016-1.333-.598-2.487-.598-1.154 0-1.511.582-2.471.614-1.008.032-1.777-.97-2.404-1.908C-.31 11.19-.896 8.44.54 6.544c.713-1.03 1.979-1.684 3.35-1.7 1.009-.017 1.96.678 2.576.678.616 0 1.772-.838 2.986-.715.508.02 1.937.206 2.854 1.55-.074.046-1.705 1.001-1.687 2.988.018 2.375 2.078 3.168 2.098 3.177-.024.066-.328 1.13-1.081 2.239"/>
      <path d="M8.5.5C9.073 1.078 9.5 1.952 9.38 2.85c-.778.062-1.717-.439-2.27-1.008C6.56 1.28 6.064.422 6.2-.5c.847-.048 1.71.49 2.3 1z" transform="translate(0 2)"/>
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="inline-block align-middle">
      <path d="M0 2.25l6.5-0.875v6.375H0V2.25zm0 11.5l6.5 0.875V8.25H0v5.5zm7.25 1L16 16V8.25H7.25v6.5zm0-13.5v6.5H16V0L7.25 1.25z"/>
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="inline-block align-middle">
      <path d="M8 1C5.79 1 4 2.79 4 5v3c0 .55-.45 1-1 1s-1 .45-1 1v2c0 .55.45 1 1 1h1c.55 0 1 .45 1 1v1h6v-1c0-.55.45-1 1-1h1c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1s-1-.45-1-1V5c0-2.21-1.79-4-4-4zm-1.5 3.5a.5.5 0 110 1 .5.5 0 010-1zm3 0a.5.5 0 110 1 .5.5 0 010-1zM6 8h4c0 1.1-.9 2-2 2s-2-.9-2-2z"/>
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block align-middle">
      <polyline points="3 11 7 7 3 3" />
      <line x1="8" y1="13" x2="13" y2="13" />
    </svg>
  );
}

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
