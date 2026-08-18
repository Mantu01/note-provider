import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileUploadField } from "@/components/shared/file-upload-field";

vi.mock("@/features/admin/api/use-upload", () => ({
  useFileUpload: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeleteUpload: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("FileUploadField", () => {
  const onChange = vi.fn();
  const kind = "cover" as const;
  const label = "Cover Image";

  beforeEach(() => {
    onChange.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the label when provided", () => {
    render(<FileUploadField kind={kind} label={label} onChange={onChange} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows upload prompt when no value is set", () => {
    render(<FileUploadField kind={kind} label={label} onChange={onChange} />);
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  it("shows preview filename when value is provided", () => {
    const value = { url: "https://example.com/img.jpg", publicId: "upload/my-cover.jpg", bytes: 1024 };
    render(<FileUploadField kind={kind} label={label} onChange={onChange} value={value} />);
    expect(screen.getByText("my-cover.jpg")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("renders a remove button when value is present", () => {
    const value = { url: "https://example.com/img.jpg", publicId: "upload/img", bytes: 1024 };
    render(<FileUploadField kind={kind} label={label} onChange={onChange} value={value} />);
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("accepts custom accept and maxSizeMB props", () => {
    render(
      <FileUploadField kind="cover" label={label} onChange={onChange} accept=".pdf,.doc" maxSizeMB={20} />
    );
    const input = document.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input?.getAttribute("accept")).toBe(".pdf,.doc");
  });

  it("disables interaction when disabled prop is true", () => {
    render(<FileUploadField kind={kind} label={label} onChange={onChange} disabled />);
    const input = document.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input?.disabled).toBe(true);
  });
});
