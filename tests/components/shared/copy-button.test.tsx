import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CopyButton } from "@/components/shared/copy-button";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

describe("CopyButton", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;
  let originalClipboard: any;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    originalClipboard = Object.getOwnPropertyDescriptor(global.navigator, 'clipboard');
  });

  afterEach(() => {
    if (originalClipboard) {
      Object.defineProperty(global.navigator, 'clipboard', originalClipboard);
    }
    vi.restoreAllMocks();
  });

  function setupMock() {
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
  }

  it("renders a button with copy icon", () => {
    setupMock();
    render(<CopyButton value="test-value" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has the correct default aria-label", () => {
    setupMock();
    render(<CopyButton value="test-value" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy to clipboard");
  });

  it("uses custom aria-label when provided", () => {
    setupMock();
    render(<CopyButton value="test-value" label="Copy note link" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy note link");
  });

  it("calls navigator.clipboard.writeText on button click", async () => {
    setupMock();
    render(<CopyButton value="test-value" />);
    const btn = screen.getByRole("button");
    await fireEvent.click(btn);
    expect(writeTextMock).toHaveBeenCalledWith("test-value");
    expect(writeTextMock).toHaveBeenCalledTimes(1);
  });
});
