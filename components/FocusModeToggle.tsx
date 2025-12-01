"use client";

import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useEffect, useState } from "react";

export default function FocusModeToggle() {
  const {
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
  } = useAccessibility();
  const [mounted, setMounted] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {/* Focus Mode Button */}
      <button
        onClick={() => {
          if (focusMode) {
            toggleFocusMode();
          } else {
            setShowPomodoro(!showPomodoro);
          }
        }}
        className={`
          w-10 h-10 border-2 border-border
          flex items-center justify-center
          transition-all duration-200
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          hover:shadow-[4px_4px_0_var(--border)]
          ${focusMode ? "bg-amber-100 dark:bg-amber-900 border-amber-500" : "bg-bg-secondary"}
        `}
        aria-label={focusMode ? "Quitter le mode focus" : "Mode focus"}
        title={focusMode ? "Quitter le mode focus" : "Mode focus"}
      >
        <span className={focusMode ? "text-amber-600 dark:text-amber-400" : "text-text-muted"}>
          {focusMode ? "🧘" : "👁"}
        </span>
      </button>

      {/* Pomodoro Dropdown */}
      {showPomodoro && !focusMode && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          <div className="p-4">
            <h3 className="font-display text-lg text-text-primary mb-4">Mode Focus</h3>

            {/* Timer display */}
            <div className="text-center mb-4">
              <div
                className={`
                  inline-block px-6 py-4 border-2 border-border
                  ${pomodoroSession === "work" ? "bg-accent/10" : "bg-emerald-50 dark:bg-emerald-900"}
                `}
              >
                <div className="font-mono text-4xl font-bold text-text-primary">
                  {formatTime(pomodoroTime)}
                </div>
                <div className="text-xs uppercase tracking-wider text-text-muted mt-1">
                  {pomodoroSession === "work" ? "Travail" : "Pause"}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 justify-center mb-4">
              {!pomodoroActive ? (
                <button
                  onClick={startPomodoro}
                  className="brutal-btn text-xs py-2 px-4"
                >
                  ▶ Démarrer
                </button>
              ) : (
                <button
                  onClick={pausePomodoro}
                  className="brutal-btn-secondary text-xs py-2 px-4"
                >
                  ⏸ Pause
                </button>
              )}
              <button
                onClick={resetPomodoro}
                className="brutal-btn-secondary text-xs py-2 px-4"
                title="Réinitialiser"
              >
                ↺
              </button>
              <button
                onClick={skipPomodoro}
                className="brutal-btn-secondary text-xs py-2 px-4"
                title="Passer"
              >
                ⏭
              </button>
            </div>

            {/* Activate focus mode */}
            <button
              onClick={() => {
                toggleFocusMode();
                setShowPomodoro(false);
              }}
              className="w-full brutal-btn-secondary text-xs"
            >
              🧘 Activer le mode zen
            </button>

            <p className="text-xs text-text-muted text-center mt-3">
              Cache la navigation et agrandit le texte
            </p>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showPomodoro && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPomodoro(false)}
        />
      )}
    </div>
  );
}

// Floating Pomodoro widget for focus mode
export function PomodoroWidget() {
  const {
    focusMode,
    toggleFocusMode,
    pomodoroActive,
    pomodoroTime,
    pomodoroSession,
    startPomodoro,
    pausePomodoro,
    isLoaded,
  } = useAccessibility();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded || !focusMode) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="bg-bg-secondary border-3 border-border shadow-brutal p-4">
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div
            className={`
              px-4 py-2 border-2 border-border
              ${pomodoroSession === "work" ? "bg-accent/10" : "bg-emerald-50 dark:bg-emerald-900"}
            `}
          >
            <div className="font-mono text-2xl font-bold text-text-primary">
              {formatTime(pomodoroTime)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted text-center">
              {pomodoroSession === "work" ? "Travail" : "Pause"}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2">
            <button
              onClick={pomodoroActive ? pausePomodoro : startPomodoro}
              className="brutal-btn-secondary text-xs py-1 px-3"
            >
              {pomodoroActive ? "⏸" : "▶"}
            </button>
            <button
              onClick={toggleFocusMode}
              className="brutal-btn-secondary text-xs py-1 px-3"
              title="Quitter le mode focus"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
