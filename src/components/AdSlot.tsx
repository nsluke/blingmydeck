"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "horizontal" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({
  slot,
  format = "horizontal",
  className = "",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet or blocked by adblocker
    }
  }, []);

  // In development, show a placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`bg-gray-800/30 border border-dashed border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-600 ${
          format === "horizontal" ? "h-[90px]" : "h-[250px] w-[300px]"
        } ${className}`}
      >
        Ad Slot: {slot}
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9191648102867518"
        data-ad-slot={slot}
        data-ad-format={format === "horizontal" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
