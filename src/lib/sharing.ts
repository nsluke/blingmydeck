import pako from "pako";
import { FilterMode } from "./constants";

export function encodeDeckList(decklist: string, filter: FilterMode): string {
  const compressed = pako.deflate(new TextEncoder().encode(decklist));
  const base64 = btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const params = new URLSearchParams();
  params.set("d", base64);
  if (filter !== FilterMode.NONE) {
    params.set("f", filter);
  }
  return `?${params.toString()}`;
}

export function decodeDeckList(
  searchParams: URLSearchParams
): { decklist: string; filter: FilterMode } | null {
  const encoded = searchParams.get("d");
  if (!encoded) return null;

  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decompressed = pako.inflate(bytes);
    const decklist = new TextDecoder().decode(decompressed);

    const filterParam = searchParams.get("f") ?? FilterMode.NONE;
    const filter = Object.values(FilterMode).includes(filterParam as FilterMode)
      ? (filterParam as FilterMode)
      : FilterMode.NONE;

    return { decklist, filter };
  } catch {
    return null;
  }
}
