import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useMutation } from "@tanstack/react-query";
import { CopyButton } from "@/components/shared/copy-button";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    isSuccess: false,
    isPending: false,
    mutate: vi.fn(),
  })),
}));

describe("CopyButton", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText: writeTextMock } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders a button with copy icon", () => {
    render(<CopyButton value="test-value" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has the correct default aria-label", () => {
    render(<CopyButton value="test-value" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy to clipboard");
  });

  it("uses custom aria-label when provided", () => {
    render(<CopyButton value="test-value" label="Copy note link" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy note link");
  });

  it("calls mutate on button click", async () => {
    const user = userEvent.setup();
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      data: undefined,
      error: null,
      variables: undefined,
      isSuccess: false,
      isPending: false,
      isError: false,
      isIdle: true,
      mutate: mockMutate,
      mutateAsync: mockMutate,
    } as unknown as ReturnType<typeof useMutation>);

    render(<CopyButton value="test-value" />);
    const btn = screen.getByRole("button");
    await user.click(btn);
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
