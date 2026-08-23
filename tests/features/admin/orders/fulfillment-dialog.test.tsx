import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FulfillmentDialog } from "@/features/admin/components/orders/fulfillment-dialog";

vi.mock("@/features/admin/api/use-admin-orders", () => ({
  useUpdateOrderFulfillment: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  })),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <option>{children}</option>,
  SelectValue: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ ...props }: any) => <textarea {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

const { useUpdateOrderFulfillment } = await import("@/features/admin/api/use-admin-orders");
const mockUseUpdateOrderFulfillment = vi.mocked(useUpdateOrderFulfillment);

describe("FulfillmentDialog", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUpdateOrderFulfillment.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as any);
  });

  it("renders dialog when open", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{
          id: "order-1",
          orderNumber: "NP-001",
          buyerFull: { socialHandle: "@johndoe", socialPlatform: "instagram" },
        } as any}
      />
    );
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <FulfillmentDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        order={null}
      />
    );
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("renders order number in title", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1", orderNumber: "NP-20260815-0001" } as any}
      />
    );
    expect(screen.getByText("Update Order #NP-20260815-0001")).toBeInTheDocument();
  });

  it("renders buyer name in description", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{
          id: "order-1",
          orderNumber: "NP-001",
          buyerFull: { fullName: "John Doe" },
        } as any}
      />
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders fulfillment status select", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1", fulfillmentStatus: "pending" } as any}
      />
    );
    expect(screen.getByText("Pending Delivery")).toBeInTheDocument();
    expect(screen.getByText("Completed (PDF Sent)")).toBeInTheDocument();
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("renders admin note textarea", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1" } as any}
      />
    );
    expect(screen.getByPlaceholderText(/e.g. Notes delivered/)).toBeInTheDocument();
  });

  it("renders cancel button", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1" } as any}
      />
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders save status button", () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1" } as any}
      />
    );
    expect(screen.getByText("Save Status")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) on cancel", async () => {
    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1" } as any}
      />
    );
    const cancelBtn = screen.getByText("Cancel");
    await userEvent.click(cancelBtn);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows loading spinner when mutating", () => {
    mockUseUpdateOrderFulfillment.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as any);

    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{ id: "order-1" } as any}
      />
    );
    const saveBtn = screen.getByText("Save Status");
    expect(saveBtn).toBeInTheDocument();
  });

  it("submits form with fulfillment status and admin note", async () => {
    const mockMutate = vi.fn();
    mockUseUpdateOrderFulfillment.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    render(
      <FulfillmentDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        order={{
          id: "order-1",
          orderNumber: "NP-001",
          fulfillmentStatus: "pending",
        } as any}
      />
    );
    const saveBtn = screen.getByText("Save Status");
    await userEvent.click(saveBtn);
    expect(mockMutate).toHaveBeenCalled();
  });
});
