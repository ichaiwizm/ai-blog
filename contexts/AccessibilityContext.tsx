"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type FontSize = "small" | "normal" | "large" | "xlarge";
export type ContrastMode = "normal" | "high";

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  // Focus mode
  focusMode: boolean;
  toggleFocusMode: () => void;
  // Pomodoro
  pomodoroActive: boolean;
  pomodoroTime: number; // seconds remaining
  pomodoroSession: "work" | "break";
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  skipPomodoro: () => void;
  isLoaded: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = "user-accessibility";
const POMODORO_WORK = 25 * 60; // 25 minutes
const POMODORO_BREAK = 5 * 60; // 5 minutes

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [contrastMode, setContrastModeState] = useState<ContrastMode>("normal");
  const [focusMode, setFocusMode] = useState(false);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(POMODORO_WORK);
  const [pomodoroSession, setPomodoroSession] = useState<"work" | "break">("work");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        if (parsed.contrastMode) setContrastModeState(parsed.contrastMode);
      } catch {
        // Invalid data
      }
    }
    setIsLoaded(true);
  }, []);

  // Apply font size to document
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    const sizes = {
      small: "0.875",
      normal: "1",
      large: "1.125",
      xlarge: "1.25",
    };
    root.style.setProperty("--font-scale", sizes[fontSize]);
    root.classList.remove("font-small", "font-normal", "font-large", "font-xlarge");
    root.classList.add(`font-${fontSize}`);
  }, [fontSize, isLoaded]);

  // Apply contrast mode
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    if (contrastMode === "high") {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  }, [contrastMode, isLoaded]);

  // Apply focus mode
  useEffect(() => {
    const root = document.documentElement;
    if (focusMode) {
      root.classList.add("focus-mode");
    } else {
      root.classList.remove("focus-mode");
    }
  }, [focusMode]);

  // Pomodoro timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroActive && pomodoroTime === 0) {
      // Timer finished
      if (pomodoroSession === "work") {
        // Switch to break
        setPomodoroSession("break");
        setPomodoroTime(POMODORO_BREAK);
        // Play notification sound or show notification
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("Pomodoro terminé !", {
              body: "Temps de pause de 5 minutes",
              icon: "/icons/icon-192x192.png",
            });
          }
        }
      } else {
        // Switch back to work
        setPomodoroSession("work");
        setPomodoroTime(POMODORO_WORK);
        setPomodoroActive(false);
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("Pause terminée !", {
              body: "Retour au travail",
              icon: "/icons/icon-192x192.png",
            });
          }
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroActive, pomodoroTime, pomodoroSession]);

  const saveToStorage = (data: { fontSize: FontSize; contrastMode: ContrastMode }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    saveToStorage({ fontSize: size, contrastMode });
  };

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode);
    saveToStorage({ fontSize, contrastMode: mode });
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  const startPomodoro = () => {
    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
    setPomodoroActive(true);
  };

  const pausePomodoro = () => {
    setPomodoroActive(false);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroSession("work");
    setPomodoroTime(POMODORO_WORK);
  };

  const skipPomodoro = () => {
    if (pomodoroSession === "work") {
      setPomodoroSession("break");
      setPomodoroTime(POMODORO_BREAK);
    } else {
      setPomodoroSession("work");
      setPomodoroTime(POMODORO_WORK);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        contrastMode,
        setContrastMode,
        focusMode,
        toggleFocusMode,
        pomodoroActive,
        pomodoroTime,
        pomodoroSession,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        skipPomodoro,
        isLoaded,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
