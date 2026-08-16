import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PdfPreviewDialog } from "@/components/shared/pdf-preview-dialog";

vi.mock("@/hooks/use-download-file", () => ({
  useDownloadFile: vi.fn(() => ({
    download: vi.fn(),
    isDownloading: false,
  })),
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("PdfPreviewDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders trigger button with preview text", () => {
    render(<PdfPreviewDialog url="/preview.pdf" filename="preview.pdf" />);
    const buttons = document.querySelectorAll('button');
    const triggerBtn = Array.from(buttons).find((b) => b.textContent?.includes("Preview PDF"));
    expect(triggerBtn).toBeInTheDocument();
  });

  it("renders iframe with correct src when dialog is opened", async () => {
    const user = userEvent.setup();
    render(<PdfPreviewDialog url="/preview.pdf" filename="preview.pdf" />);
    const buttons = document.querySelectorAll('button');
    const triggerBtn = Array.from(buttons).find((b) => b.textContent?.includes("Preview PDF"));
    if (triggerBtn) await user.click(triggerBtn);
    await vi.waitFor(() => {
      const iframe = document.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute("src", "/preview.pdf");
    });
  });

  it("renders dialog title when opened", async () => {
    const user = userEvent.setup();
    render(<PdfPreviewDialog url="/preview.pdf" filename="preview.pdf" />);
    const buttons = document.querySelectorAll('button');
    const triggerBtn = Array.from(buttons).find((b) => b.textContent?.includes("Preview PDF"));
    if (triggerBtn) await user.click(triggerBtn);
    await vi.waitFor(() => {
      expect(screen.getByText("Note Preview")).toBeInTheDocument();
    });
  });

  it("renders dialog description when opened", async () => {
    const user = userEvent.setup();
    render(<PdfPreviewDialog url="/preview.pdf" filename="preview.pdf" />);
    const buttons = document.querySelectorAll('button');
    const triggerBtn = Array.from(buttons).find((b) => b.textContent?.includes("Preview PDF"));
    if (triggerBtn) await user.click(triggerBtn);
    await vi.waitFor(() => {
      expect(screen.getByText("Review a sample before purchasing the full notes.")).toBeInTheDocument();
    });
  });

  it("renders download button when opened", async () => {
    const user = userEvent.setup();
    render(<PdfPreviewDialog url="/preview.pdf" filename="preview.pdf" />);
    const buttons = document.querySelectorAll('button');
    const triggerBtn = Array.from(buttons).find((b) => b.textContent?.includes("Preview PDF"));
    if (triggerBtn) await user.click(triggerBtn);
    await vi.waitFor(() => {
      const allButtons = document.querySelectorAll('button');
      const downloadBtn = Array.from(allButtons).find((b) => b.textContent?.includes("Download"));
      expect(downloadBtn).toBeInTheDocument();
    });
  });

  it("download button is not disabled when not downloading", async () => {
    const user = userEvent.setup();
    render(<PdfPreviewDialog url="/preview.pdf" filename="preview.pdf" />);
    const buttons = document.querySelectorAll('button');
    const triggerBtn = Array.from(buttons).find((b) => b.textContent?.includes("Preview PDF"));
    if (triggerBtn) await user.click(triggerBtn);
    await vi.waitFor(() => {
      const allButtons = document.querySelectorAll('button');
      const downloadBtn = Array.from(allButtons).find((b) => b.textContent?.includes("Download"));
      expect(downloadBtn).not.toBeDisabled();
    });
  });
});
