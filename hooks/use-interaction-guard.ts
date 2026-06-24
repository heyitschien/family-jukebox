"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COOLDOWN_MS = 2000;

function isFocusableInput(element: Element | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tag = element.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return element.isContentEditable;
}

export function useInteractionGuard() {
  const [canAutoSync, setCanAutoSync] = useState(true);
  const lastInteractionRef = useRef(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputFocusedRef = useRef(false);

  const updateCanAutoSync = useCallback(() => {
    const inCooldown = Date.now() - lastInteractionRef.current < COOLDOWN_MS;
    setCanAutoSync(!inputFocusedRef.current && !inCooldown);
  }, []);

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setCanAutoSync(false);

    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(updateCanAutoSync, COOLDOWN_MS);
  }, [updateCanAutoSync]);

  useEffect(() => {
    const handleInteraction = () => markInteraction();

    const events = ["pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    for (const event of events) {
      window.addEventListener(event, handleInteraction, { passive: true, capture: true });
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (isFocusableInput(event.target as Element)) {
        inputFocusedRef.current = true;
        updateCanAutoSync();
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (!isFocusableInput(event.target as Element)) return;
      requestAnimationFrame(() => {
        inputFocusedRef.current = isFocusableInput(document.activeElement);
        updateCanAutoSync();
      });
    };

    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("focusout", handleFocusOut, true);

    return () => {
      for (const event of events) {
        window.removeEventListener(event, handleInteraction, { capture: true });
      }
      document.removeEventListener("focusin", handleFocusIn, true);
      document.removeEventListener("focusout", handleFocusOut, true);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [markInteraction, updateCanAutoSync]);

  return { canAutoSync, markInteraction };
}
