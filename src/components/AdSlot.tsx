"use client";

interface AdSlotProps {
  slot: string;
  format?: "horizontal" | "rectangle";
  className?: string;
}

/**
 * Placeholder for Google AdSense ad unit.
 * Replace data-ad-client and data-ad-slot with real values once AdSense is approved.
 */
export default function AdSlot({
  slot,
  format = "horizontal",
  className = "",
}: AdSlotProps) {
  // In development, show a placeholder
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
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
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format === "horizontal" ? "horizontal" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
