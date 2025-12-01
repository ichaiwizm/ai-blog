"use client";

import { ReactNode } from "react";
import { usePlatform, Platform, PLATFORMS } from "@/contexts/PlatformContext";

interface PlatformContentProps {
  children: ReactNode;
}

interface PlatformSpecificProps {
  children: ReactNode;
}

// Wrapper component that contains platform-specific content
export function PlatformContent({ children }: PlatformContentProps) {
  const { isLoaded } = usePlatform();

  if (!isLoaded) {
    return (
      <div className="my-4 p-4 bg-bg-tertiary border-2 border-border-light animate-pulse">
        <div className="h-4 bg-border-light rounded w-1/2 mb-2" />
        <div className="h-4 bg-border-light rounded w-3/4" />
      </div>
    );
  }

  return <div className="platform-content">{children}</div>;
}

// Individual platform components
export function Mac({ children }: PlatformSpecificProps) {
  const { platform } = usePlatform();
  if (platform !== "mac") return null;
  return <>{children}</>;
}

export function Windows({ children }: PlatformSpecificProps) {
  const { platform } = usePlatform();
  if (platform !== "windows") return null;
  return <>{children}</>;
}

export function Linux({ children }: PlatformSpecificProps) {
  const { platform } = usePlatform();
  if (platform !== "linux") return null;
  return <>{children}</>;
}

export function WSL({ children }: PlatformSpecificProps) {
  const { platform } = usePlatform();
  if (platform !== "wsl") return null;
  return <>{children}</>;
}

// Show on multiple platforms
interface MultiPlatformProps {
  platforms: Platform[];
  children: ReactNode;
}

export function OnPlatforms({ platforms, children }: MultiPlatformProps) {
  const { platform } = usePlatform();
  if (!platforms.includes(platform)) return null;
  return <>{children}</>;
}

// Show on Unix-like systems (Mac, Linux, WSL)
export function Unix({ children }: PlatformSpecificProps) {
  const { platform } = usePlatform();
  if (!["mac", "linux", "wsl"].includes(platform)) return null;
  return <>{children}</>;
}

// A fancy switcher that shows all platforms with tabs
interface PlatformSwitcherProps {
  mac?: ReactNode;
  windows?: ReactNode;
  linux?: ReactNode;
  wsl?: ReactNode;
}

export function PlatformSwitcher({ mac, windows, linux, wsl }: PlatformSwitcherProps) {
  const { platform, setPlatform, isLoaded } = usePlatform();

  const availablePlatforms = [
    { key: "mac" as Platform, content: mac },
    { key: "windows" as Platform, content: windows },
    { key: "linux" as Platform, content: linux },
    { key: "wsl" as Platform, content: wsl },
  ].filter((p) => p.content !== undefined);

  if (!isLoaded) {
    return (
      <div className="my-6 border-3 border-border bg-bg-secondary">
        <div className="h-12 bg-bg-tertiary border-b-2 border-border animate-pulse" />
        <div className="p-4">
          <div className="h-4 bg-border-light rounded w-3/4 mb-2" />
          <div className="h-4 bg-border-light rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Find current platform content, fallback to first available
  const currentPlatform = availablePlatforms.find((p) => p.key === platform) || availablePlatforms[0];

  return (
    <div className="my-6 border-3 border-border bg-bg-secondary not-prose">
      {/* Platform tabs */}
      <div className="flex border-b-2 border-border bg-bg-tertiary overflow-x-auto">
        {availablePlatforms.map(({ key }) => {
          const info = PLATFORMS[key];
          const isActive = currentPlatform?.key === key;

          return (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-sm font-medium transition-all border-r-2 border-border last:border-r-0 whitespace-nowrap ${
                isActive
                  ? "bg-accent text-text-inverse"
                  : "text-text-muted hover:bg-bg-secondary hover:text-text-primary"
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 prose prose-lg max-w-none">
        {currentPlatform?.content}
      </div>
    </div>
  );
}

// Inline platform indicator
export function PlatformBadge() {
  const { platform, isLoaded } = usePlatform();

  if (!isLoaded) return null;

  const info = PLATFORMS[platform];

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-bg-tertiary border border-border-light font-mono text-xs">
      <span>{info.icon}</span>
      <span>{info.label}</span>
    </span>
  );
}
