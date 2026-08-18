import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotesPage from "@/app/(public)/notes/page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => "/notes"),
}));

vi.mock("@/features/notes/components/notes-catalogue", () => ({
  NotesCatalogue: () => <div data-testid="notes-catalogue">Notes Catalogue</div>,
}));

vi.mock("@/components/seo/json-ld", () => ({
  __esModule: true,
  default: () => null,
  webpageJsonLd: () => [],
}));

describe("NotesPage (route)", () => {
  it("renders notes catalogue", async () => {
    const Page = (await import("@/app/(public)/notes/page")).default;
    render(<Page />);
    expect(screen.getByTestId("notes-catalogue")).toBeInTheDocument();
  });

  it("has correct metadata title", async () => {
    const mod = await import("@/app/(public)/notes/page");
    expect(mod.metadata).toBeDefined();
    expect((mod.metadata as any).title).toContain("Coding Notes");
  });
});
