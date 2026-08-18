import "@testing-library/jest-dom/vitest";
import { afterEach, vi, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "vitest-canvas-mock";

declare global {
  var __rateLimitStore: Map<string, unknown> | undefined;
  var __queryClient: { clear: () => void } | undefined;
}

afterEach(() => {
  cleanup();
  const store = global.__rateLimitStore;
  if (store) store.clear();
  global.__queryClient?.clear();
});

beforeEach(() => {
  vi.clearAllMocks();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

vi.mock("nuqs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("nuqs")>();
  return {
    ...actual,
    useQueryStates: vi.fn(() => [{ page: 1, search: "" }, vi.fn()]),
    useQueryState: vi.fn(() => ["", vi.fn()]),
  };
});

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      pathname: "/",
      query: {},
    })),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    usePathname: vi.fn(() => "/"),
  };
});
