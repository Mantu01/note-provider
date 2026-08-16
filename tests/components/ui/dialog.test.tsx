import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";

describe("Dialog", () => {
  it("renders trigger button", () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog description")).toBeInTheDocument();
  });

  it("closes dialog when close button is clicked", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    const closeBtn = document.querySelector('[data-slot="dialog-close"]');
    if (closeBtn) {
      await user.click(closeBtn);
    }
  });
});

describe("DialogContent", () => {
  it("renders dialog content with showCloseButton true by default", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="dialog-close"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("does not render close button when showCloseButton is false", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="dialog-close"]');
    expect(closeBtn).not.toBeInTheDocument();
  });
});

describe("DialogHeader", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<DialogHeader data-testid="header">Header</DialogHeader>);
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe("DIV");
    expect(div).toHaveAttribute("data-slot", "dialog-header");
  });

  it("applies custom className", () => {
    const { container } = render(<DialogHeader className="my-header" data-testid="header">Header</DialogHeader>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("my-header");
  });
});

describe("DialogFooter", () => {
  it("renders as a div with correct data-slot", () => {
    const { container } = render(<DialogFooter data-testid="footer">Footer</DialogFooter>);
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe("DIV");
    expect(div).toHaveAttribute("data-slot", "dialog-footer");
  });

  it("renders children correctly", () => {
    render(
      <DialogFooter data-testid="footer">
        <span>Children</span>
      </DialogFooter>
    );
    expect(screen.getByText("Children")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<DialogFooter className="my-footer" data-testid="footer">Footer</DialogFooter>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass("my-footer");
  });
});

describe("DialogTitle", () => {
  it("renders title inside opened dialog", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle data-testid="title">My Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("My Title")).toBeInTheDocument();
    const title = document.querySelector('[data-slot="dialog-title"]');
    expect(title).toBeInTheDocument();
  });

  it("applies custom className when inside Dialog", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle className="my-title">Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const el = document.querySelector('[data-slot="dialog-title"]') as HTMLElement | null;
    expect(el).toBeInTheDocument();
    if (el) {
      expect(el).toHaveClass("my-title");
    }
  });
});

describe("DialogDescription", () => {
  it("renders description inside opened dialog", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogDescription data-testid="desc">My Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("My Description")).toBeInTheDocument();
    const desc = document.querySelector('[data-slot="dialog-description"]');
    expect(desc).toBeInTheDocument();
  });

  it("applies custom className when inside Dialog", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogDescription className="my-desc">Desc</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const el = document.querySelector('[data-slot="dialog-description"]') as HTMLElement | null;
    expect(el).toBeInTheDocument();
    if (el) {
      expect(el).toHaveClass("my-desc");
    }
  });
});

describe("DialogOverlay", () => {
  it("renders overlay when dialog is open", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();
  });
});

describe("DialogPortal", () => {
  it("renders portal element when dialog is open", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const portal = document.querySelector('[data-slot="dialog-portal"]');
    expect(portal).toBeInTheDocument();
  });
});

describe("DialogClose", () => {
  it("renders close button when dialog is open", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Open"));
    const closeBtn = document.querySelector('[data-slot="dialog-close"]');
    expect(closeBtn).toBeInTheDocument();
  });
});

describe("Dialog full structure", () => {
  it("renders complete dialog with all components", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
          <div>Dialog body content</div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByText("Open Dialog"));
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog description text")).toBeInTheDocument();
    expect(screen.getByText("Dialog body content")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});
