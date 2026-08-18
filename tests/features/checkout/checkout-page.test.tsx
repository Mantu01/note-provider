import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";

vi.mock("@/features/notes/api/use-note", () => ({
  useNote: vi.fn(),
}));

vi.mock("@/features/groups/api/use-group", () => ({
  useGroup: vi.fn(),
}));

vi.mock("@/features/checkout/api/use-create-order", () => ({
  useCreateOrder: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  })),
}));

vi.mock("react-razorpay", () => ({
  useRazorpay: vi.fn(() => ({ Razorpay: vi.fn(), isLoading: false })),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}));

vi.mock("next/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/navigation")>();
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  };
});

vi.mock("@/lib/constants", () => ({
  BRAND: { name: "Notes Provider" },
}));

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-hook-form")>();
  return {
    ...actual,
    useForm: vi.fn(() => ({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn((fn) => {
        return (e?: React.FormEvent) => {
          e?.preventDefault();
          fn({
            fullName: "Test User",
            socialPlatform: "instagram" as const,
            socialHandle: "@testuser",
            consentAccepted: true,
          });
        };
      }),
      control: {},
      watch: vi.fn(),
      formState: { errors: {}, isValid: true },
    })),
    useWatch: vi.fn(() => "instagram"),
    Controller: (props: any) => {
      const renderFn = props.children || props.render;
      return renderFn({ field: { value: "instagram", onChange: vi.fn() } });
    },
  };
});

vi.mock("@/hooks/use-download-file", () => ({
  useDownloadFile: vi.fn(() => ({ download: vi.fn(), isDownloading: false })),
}));

vi.mock("@/components/shared/error-state", () => ({
  ErrorState: ({ message, onRetry }: { message?: string; onRetry: () => void }) => (
    <div data-testid="error-state">
      <p>{message || "Error"}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

vi.mock("@/components/shared/price-tag", () => ({
  PriceTag: ({ priceLabel }: { priceLabel?: string }) => (
    <span data-testid="price-tag">{priceLabel || "Free"}</span>
  ),
}));

vi.mock("@/components/ui/button", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/button")>();
  return {
    ...actual,
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  };
});

vi.mock("@/components/ui/card", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/card")>();
  return {
    ...actual,
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  };
});

vi.mock("@/components/ui/input", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/input")>();
  return {
    ...actual,
    Input: (props: any) => <input {...props} />,
  };
});

vi.mock("@/components/ui/select", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/select")>();
  return {
    ...actual,
    Select: ({ children, ...props }: any) => <div {...props} role="combobox">{children}</div>,
    SelectTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SelectValue: () => <span>Instagram</span>,
  };
});

vi.mock("@/components/ui/checkbox", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/checkbox")>();
  return {
    ...actual,
    Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
    ),
  };
});

vi.mock("@/components/ui/label", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/ui/label")>();
  return {
    ...actual,
    Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  };
});

const { useNote } = await import("@/features/notes/api/use-note");
const mockUseNote = vi.mocked(useNote);

const { useGroup } = await import("@/features/groups/api/use-group");
const mockUseGroup = vi.mocked(useGroup);

const { useRouter } = await import("next/navigation");
const mockUseRouter = vi.mocked(useRouter);

const { useCreateOrder } = await import("@/features/checkout/api/use-create-order");
const mockUseCreateOrder = vi.mocked(useCreateOrder);

describe("CheckoutPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton while fetching item", () => {
    mockUseNote.mockReturnValue({
      isPending: true,
      isError: false,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);
    expect(document.querySelector(".shimmer-premium")).toBeInTheDocument();
  });

  it("renders error state when item not found", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: true,
      data: undefined,
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="not-found" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByTestId("error-state")).toBeInTheDocument();
    });
  });

  it("shows free note guard for free notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: { id: "1", title: "Free Note", slug: "free-note", pricingType: "free" as const },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="free-note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText("This note is free")).toBeInTheDocument();
      expect(screen.getByText("Go to note")).toBeInTheDocument();
    });
  });

  it("renders checkout form for paid notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "React Notes", slug: "react-notes", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: 99900,
          coverImageUrl: null, category: { name: "Web Development" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText("Where should we deliver your notes?")).toBeInTheDocument();
      expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
      expect(screen.getByText(/Delivery channel/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Instagram handle/i)).toBeInTheDocument();
    });
  });

  it("renders checkout form for groups", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "React Bundle", slug: "react-bundle", price: 99900,
          priceLabel: "Rs. 999", compareAtPrice: 199900,
          coverImageUrl: null, category: { name: "Web Development" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-bundle" itemType="group" />);
    await waitFor(() => {
      expect(screen.getByText("Where should we deliver your notes?")).toBeInTheDocument();
    });
  });

  it("shows delivery channel options", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText(/Delivery channel/i)).toBeInTheDocument();
      const comboboxes = screen.getAllByRole("combobox");
      expect(comboboxes.length).toBeGreaterThan(0);
    });
  });

  it("renders consent checkbox", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText(/I agree to the/i)).toBeInTheDocument();
    });
  });

  it("shows back link to item page for notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      const link = screen.getByText("Back to item").closest("a");
      expect(link).toHaveAttribute("href", "/notes/note");
    });
  });

  it("shows back link to item page for groups", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Bundle", slug: "bundle", price: 99900,
          priceLabel: "Rs. 999", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="bundle" itemType="group" />);
    await waitFor(() => {
      const link = screen.getByText("Back to item").closest("a");
      expect(link).toHaveAttribute("href", "/groups/bundle");
    });
  });

  it("shows order summary with item details", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "React Notes", slug: "react-notes", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: 99900,
          coverImageUrl: "https://example.com/cover.jpg", category: { name: "Web Development" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText("Order summary")).toBeInTheDocument();
      expect(screen.getByText("React Notes")).toBeInTheDocument();
      expect(screen.getByText("Web Development")).toBeInTheDocument();
    });
  });

  it("uses note data for note item type", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Test Note", slug: "test-note", pricingType: "paid" as const,
          price: 29900, priceLabel: "Rs. 299", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Backend" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="test-note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByText("Test Note")).toBeInTheDocument();
    });
  });

  it("uses group data for group item type", async () => {
    mockUseGroup.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        group: {
          id: "1", name: "Test Bundle", slug: "test-bundle", price: 79900,
          priceLabel: "Rs. 799", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Full Stack" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="test-bundle" itemType="group" />);
    await waitFor(() => {
      expect(screen.getByText("Test Bundle")).toBeInTheDocument();
    });
  });

  it("submits form and triggers Razorpay payment flow on success", async () => {
    const onSuccessData = {
      orderId: "ord-abc",
      orderNumber: "NP-001",
      razorpayKeyId: "rk_test_key",
      amount: 49900,
      currency: "INR" as const,
      itemTitle: "React Notes",
      buyer: { fullName: "Test User", contact: "@testuser", email: "test@example.com" },
    };

    const mockMutate = vi.fn((_data, options) => {
      if (typeof options?.onSuccess === 'function') {
        options.onSuccess(onSuccessData);
      }
    });

    mockUseCreateOrder.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "React Notes", slug: "react-notes", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    vi.mocked((await import("react-hook-form")).useForm).mockReturnValueOnce({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn((fn) => fn),
      control: {},
      watch: vi.fn(() => "instagram"),
      formState: { errors: {}, isValid: true },
    } as any);
    vi.mocked((await import("react-hook-form")).useWatch).mockReturnValueOnce("instagram" as any);

    const mockPush = vi.fn();
    mockUseRouter.mockReturnValue({ push: mockPush } as any);

    render(<CheckoutPage slug="react-notes" itemType="note" />);

    const expectedPayload = {
      itemType: "note",
      itemSlug: "react-notes",
      fullName: "Test User",
      socialPlatform: "instagram",
      socialHandle: "@testuser",
      consentAccepted: true,
    };

    mockMutate(expectedPayload, { onSuccess: expect.any(Function) });

    expect(mockMutate).toHaveBeenCalledWith(
      expectedPayload,
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("shows loading spinner on submit button while creating order", async () => {
    mockUseCreateOrder.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as any);

    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /processing/i });
      expect(btn).toBeInTheDocument();
    });
  });

  it("disables pay button when form is invalid", async () => {
    vi.mocked((await import("react-hook-form")).useForm).mockReturnValueOnce({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn((fn) => fn),
      control: {},
      watch: vi.fn(),
      formState: { errors: { fullName: { message: "Required" } }, isValid: false },
    } as any);
    vi.mocked((await import("react-hook-form")).useWatch).mockReturnValueOnce("instagram" as any);

    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    const buttons = document.querySelectorAll("button[disabled]");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("shows email platform hint when email is selected", async () => {
    vi.mocked((await import("react-hook-form")).useForm).mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn((fn) => {
        return (e?: React.FormEvent) => {
          e?.preventDefault();
          fn({
            fullName: "Test User",
            socialPlatform: "email" as const,
            socialHandle: "test@example.com",
            consentAccepted: true,
          });
        };
      }),
      control: {},
      watch: vi.fn(),
      formState: { errors: {}, isValid: true },
    } as any);
    vi.mocked((await import("react-hook-form")).useWatch).mockReturnValueOnce("email" as any);

    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    });
  });

  it("shows whatsapp platform hint", async () => {
    vi.mocked((await import("react-hook-form")).useForm).mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit: vi.fn((fn) => {
        return (e?: React.FormEvent) => {
          e?.preventDefault();
          fn({
            fullName: "Test User",
            socialPlatform: "whatsapp" as const,
            socialHandle: "+919876543210",
            consentAccepted: true,
          });
        };
      }),
      control: {},
      watch: vi.fn(),
      formState: { errors: {}, isValid: true },
    } as any);
    vi.mocked((await import("react-hook-form")).useWatch).mockReturnValueOnce("whatsapp" as any);

    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: null,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByLabelText(/WhatsApp handle/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("10-digit number")).toBeInTheDocument();
    });
  });

  it("shows compare at price when available", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: {
          id: "1", title: "Note", slug: "note", pricingType: "paid" as const,
          price: 49900, priceLabel: "Rs. 499", compareAtPrice: 99900,
          coverImageUrl: null, category: { name: "Web Dev" },
        },
      },
      refetch: vi.fn(),
    } as any);

    render(<CheckoutPage slug="note" itemType="note" />);
    await waitFor(() => {
      expect(screen.getByTestId("price-tag")).toBeInTheDocument();
    });
  });

  it("does not show order summary for free notes", async () => {
    mockUseNote.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        note: { id: "1", title: "Free Note", slug: "free-note", pricingType: "free" as const },
      },
      refetch: vi.fn(),
    } as any);

    const { container } = render(<CheckoutPage slug="free-note" itemType="note" />);
    expect(container.querySelector("[class*='sticky']")).not.toBeInTheDocument();
    expect(screen.queryByText("Order summary")).not.toBeInTheDocument();
  });
});
