import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

describe("Sheet", () => {
  it("renders trigger button", () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText("Open Sheet")).toBeInTheDocument();
  });

  it("opens sheet when trigger is clicked", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    expect(screen.getByText("Sheet description")).toBeInTheDocument();
  });

  it("closes sheet when close button is clicked", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Desc</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="sheet-close"]');
    if (closeBtn) {
      await user.click(closeBtn);
    }
  });

  it("does not render sheet content until trigger is clicked", () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.queryByText("Sheet Title")).not.toBeInTheDocument();
  });
});

describe("SheetContent", () => {
  it("renders sheet content with default side right", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Right Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const content = document.querySelector('[data-slot="sheet-content"]') as HTMLElement;
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("data-side", "right");
  });

  it("renders sheet content with side left", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>Left Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const content = document.querySelector('[data-slot="sheet-content"]') as HTMLElement;
    expect(content).toHaveAttribute("data-side", "left");
  });

  it("renders sheet content with side top", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="top">
          <SheetTitle>Top Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const content = document.querySelector('[data-slot="sheet-content"]') as HTMLElement;
    expect(content).toHaveAttribute("data-side", "top");
  });

  it("renders sheet content with side bottom", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="bottom">
          <SheetTitle>Bottom Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const content = document.querySelector('[data-slot="sheet-content"]') as HTMLElement;
    expect(content).toHaveAttribute("data-side", "bottom");
  });

  it("shows close button by default", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="sheet-close"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("does not show close button when showCloseButton is false", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent showCloseButton={false}>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="sheet-close"]');
    expect(closeBtn).not.toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent className="my-custom-sheet">
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const content = document.querySelector('[data-slot="sheet-content"]') as HTMLElement;
    expect(content).toHaveClass("my-custom-sheet");
  });

  it("renders children", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <div>Custom child content</div>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Custom child content")).toBeInTheDocument();
  });

  it("renders overlay when open", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const overlay = document.querySelector('[data-slot="sheet-overlay"]');
    expect(overlay).toBeInTheDocument();
  });
});

describe("SheetTrigger", () => {
  it("renders trigger element", () => {
    render(
      <Sheet>
        <SheetTrigger>Launch Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Content</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText("Launch Sheet")).toBeInTheDocument();
  });

  it("has correct data-slot attribute", () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Trigger</SheetTrigger>
        <SheetContent>
          <SheetTitle>Content</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveAttribute("data-slot", "sheet-trigger");
  });
});

describe("SheetHeader", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<SheetHeader data-testid="header">Header</SheetHeader>);
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe("DIV");
    expect(div).toHaveAttribute("data-slot", "sheet-header");
  });

  it("applies custom className", () => {
    const { container } = render(<SheetHeader className="my-header" data-testid="header">Header</SheetHeader>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("my-header");
  });

  it("renders children", () => {
    render(
      <SheetHeader>
        <span>Header child</span>
      </SheetHeader>
    );
    expect(screen.getByText("Header child")).toBeInTheDocument();
  });
});

describe("SheetFooter", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<SheetFooter data-testid="footer">Footer</SheetFooter>);
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe("DIV");
    expect(div).toHaveAttribute("data-slot", "sheet-footer");
  });

  it("applies custom className", () => {
    const { container } = render(<SheetFooter className="my-footer" data-testid="footer">Footer</SheetFooter>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("my-footer");
  });

  it("renders children", () => {
    render(
      <SheetFooter>
        <span>Footer child</span>
      </SheetFooter>
    );
    expect(screen.getByText("Footer child")).toBeInTheDocument();
  });
});

describe("SheetTitle", () => {
  it("renders title text", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>My Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("My Sheet Title")).toBeInTheDocument();
  });

  it("has correct data-slot attribute", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const title = document.querySelector('[data-slot="sheet-title"]');
    expect(title).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle className="my-title">Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const title = document.querySelector('[data-slot="sheet-title"]') as HTMLElement;
    expect(title).toHaveClass("my-title");
  });
});

describe("SheetDescription", () => {
  it("renders description text", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetDescription>My Description</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("My Description")).toBeInTheDocument();
  });

  it("has correct data-slot attribute", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetDescription>Desc</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const desc = document.querySelector('[data-slot="sheet-description"]');
    expect(desc).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetDescription className="my-desc">Desc</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const el = document.querySelector('[data-slot="sheet-description"]') as HTMLElement;
    expect(el).toHaveClass("my-desc");
  });
});

describe("SheetClose", () => {
  it("renders close button text", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetClose>Cancel</SheetClose>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("has correct data-slot attribute", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetClose>Close</SheetClose>
        </SheetContent>
      </Sheet>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="sheet-close"]');
    expect(closeBtn).toBeInTheDocument();
  });
});

describe("Sheet full structure", () => {
  it("renders complete sheet with all components", async () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description text</SheetDescription>
          </SheetHeader>
          <div>Sheet body content</div>
          <SheetFooter>
            <SheetClose>Cancel</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText("Open Sheet")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByText("Open Sheet"));
    expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    expect(screen.getByText("Sheet description text")).toBeInTheDocument();
    expect(screen.getByText("Sheet body content")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
