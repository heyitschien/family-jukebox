"use client";

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { cn } from "@/lib/utils";

type PlaybackProgressBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  "aria-label"?: string;
};

export function clampSeekTime(seconds: number, duration: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) return 0;
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.min(seconds, duration);
}

export function PlaybackProgressBar({
  currentTime,
  duration,
  onSeek,
  className,
  trackClassName,
  barClassName,
  "aria-label": ariaLabel = "Playback progress",
}: PlaybackProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);

  const displayTime = scrubTime ?? currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;
  const disabled = duration <= 0;

  const timeFromClientX = useCallback(
    (clientX: number): number | null => {
      const track = trackRef.current;
      if (!track || duration <= 0) return null;

      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return null;

      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return clampSeekTime(ratio * duration, duration);
    },
    [duration],
  );

  const finishScrub = useCallback(
    (time: number | null) => {
      setScrubbing(false);
      setScrubTime(null);
      if (time !== null) onSeek(time);
    },
    [onSeek],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;

    const time = timeFromClientX(event.clientX);
    if (time === null) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    setScrubTime(time);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing || disabled) return;

    const time = timeFromClientX(event.clientX);
    if (time !== null) setScrubTime(time);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const time = timeFromClientX(event.clientX) ?? scrubTime;
    finishScrub(time);
  };

  const onPointerCancel = () => {
    if (!scrubbing) return;
    finishScrub(scrubTime);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const step = event.shiftKey ? 10 : 5;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onSeek(clampSeekTime(currentTime + step, duration));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onSeek(clampSeekTime(currentTime - step, duration));
    } else if (event.key === "Home") {
      event.preventDefault();
      onSeek(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onSeek(duration);
    }
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(displayTime)}
      aria-disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative touch-none select-none",
        disabled ? "cursor-default" : "cursor-pointer",
        className,
      )}
    >
      <div
        className={cn(
          "h-full w-full overflow-hidden rounded-full bg-white/15",
          trackClassName,
        )}
      >
        <div
          className={cn(
            "family-progress h-full origin-left",
            scrubbing ? "transition-none" : "transition-[width] duration-150 ease-linear",
            barClassName,
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
