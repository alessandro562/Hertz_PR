import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo — OFFICIAL hertz brand asset only. Never re-draw the wordmark or the
 * waveform mark by hand; always render these files (public/brand/*).
 *
 *  variant="lockup"   → waveform mark stacked over the "hertz" wordmark (default)
 *  variant="wordmark" → "hertz" wordmark alone
 *  variant="mark"     → sine-wave mark alone (use for the app icon / avatar)
 *
 * White assets are supplied for dark surfaces (the PR Hub default).
 */
type Variant = "lockup" | "wordmark" | "mark";

const files: Record<Variant, { src: string; w: number; h: number }> = {
  lockup: { src: "/brand/hertz-lockup-white.png", w: 300, h: 195 },
  wordmark: { src: "/brand/hertz-wordmark-white.png", w: 300, h: 95 },
  mark: { src: "/brand/hertz-mark-white.png", w: 120, h: 78 },
};

export interface LogoProps {
  variant?: Variant;
  /** rendered height in px; width scales to the asset's aspect ratio */
  height?: number;
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "lockup", height = 28, className, priority }: LogoProps) {
  const f = files[variant];
  const width = Math.round((f.w / f.h) * height);
  return (
    <Image
      src={f.src}
      alt="hertz"
      width={width}
      height={height}
      priority={priority}
      className={cn("select-none", className)}
    />
  );
}
