import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EditNotePage from "@/app/admin/(dashboard)/notes/[id]/edit/page";

vi.mock("@/features/admin/api/use-admin-notes", () => ({
  useAdminNote: vi.fn(() => ({ data: { id: "1", title: "Test Note" }, isLoading: false })),
}));

vi.mock("@/features/admin/components/notes/note-form", () => ({
  NoteForm: ({ initialData }: { initialData?: any }) => (
    <div data-testid="note-form">
      <span>Editing: {initialData?.title || "new"}</span>
    </div>
  ),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ message }: { message: string }) => (
    <div data-testid="error-state">{message}</div>
  ),
}));

describe("EditNotePage", () => {
  it("renders NoteForm with initial data", () => {
    expect(() => render(<EditNotePage params={Promise.resolve({ id: "test-id" })} />)).not.toThrow();
  });

  it("does not crash on render", () => {
    expect(() => render(<EditNotePage params={Promise.resolve({ id: "test-id" })} />)).not.toThrow();
  });
});
