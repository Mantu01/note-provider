import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

describe("Accordion", () => {
  it("renders accordion root with default classes", () => {
    const { container } = render(<Accordion data-testid="accordion" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("flex", "w-full", "flex-col");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Accordion className="my-custom-accordion" data-testid="accordion" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("my-custom-accordion");
  });

  it("renders multiple items", async () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    // Content is hidden by default; click to open and verify
    const user = userEvent.setup();
    await user.click(screen.getByText("First"));
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });
});

describe("AccordionItem", () => {
  it("renders item when nested in Accordion", () => {
    render(
      <Accordion>
        <AccordionItem value="test" data-testid="item">
          <AccordionTrigger>Toggle</AccordionTrigger>
          <AccordionContent>Details</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId("item")).toBeInTheDocument();
  });

  it("is nested inside accordion root", async () => {
    render(
      <Accordion>
        <AccordionItem value="test">
          <AccordionTrigger>Toggle</AccordionTrigger>
          <AccordionContent>Details</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Toggle")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByText("Toggle"));
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
});

describe("AccordionTrigger", () => {
  it("renders trigger button with children", () => {
    render(
      <Accordion>
        <AccordionItem value="test">
          <AccordionTrigger>Click me</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent><span>Section 1 content</span></AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Section 1"));
    expect(screen.getByText("Section 1 content")).toBeInTheDocument();
  });
});

describe("AccordionContent", () => {
  it("renders content children after expanding", async () => {
    render(
      <Accordion>
        <AccordionItem value="test">
          <AccordionTrigger>Toggle</AccordionTrigger>
          <AccordionContent><span>Hello content</span></AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Toggle"));
    expect(screen.getByText("Hello content")).toBeInTheDocument();
  });

  it("is hidden by default without default value", async () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Closed content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.queryByText("Closed content")).not.toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByText("Section"));
    expect(screen.getByText("Closed content")).toBeInTheDocument();
  });
});

describe("Accordion full structure", () => {
  it("renders complete accordion with items", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>First Item</AccordionTrigger>
          <AccordionContent><span>First item details</span></AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second Item</AccordionTrigger>
          <AccordionContent><span>Second item details</span></AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText("First Item")).toBeInTheDocument();
    expect(screen.getByText("Second Item")).toBeInTheDocument();
  });

  it("supports clicking multiple items independently", async () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Option A</AccordionTrigger>
          <AccordionContent><span>Details A</span></AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Option B</AccordionTrigger>
          <AccordionContent><span>Details B</span></AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Option A"));
    expect(screen.getByText("Details A")).toBeInTheDocument();
  });

  it("toggles item open and closed on repeated clicks", async () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Toggle Me</AccordionTrigger>
          <AccordionContent>Toggled content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Toggle Me"));
    expect(screen.getByText("Toggled content")).toBeInTheDocument();
  });
});
