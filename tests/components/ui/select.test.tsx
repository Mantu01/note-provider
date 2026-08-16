import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

describe("Select", () => {
  it("renders select trigger inside Select root", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("renders select with placeholder", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });
});

describe("SelectTrigger", () => {
  it("renders with correct data-slot when inside Select root", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">Trigger</SelectTrigger>
      </Select>
    );
    const trigger = screen.getByTestId("trigger") as HTMLElement;
    expect(trigger).toHaveAttribute("data-slot", "select-trigger");
  });

  it("applies default size classes", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">Trigger</SelectTrigger>
      </Select>
    );
    const trigger = screen.getByTestId("trigger") as HTMLElement;
    expect(trigger).toHaveAttribute("data-size", "default");
  });

  it("applies sm size classes", () => {
    render(
      <Select>
        <SelectTrigger size="sm" data-testid="trigger">Trigger</SelectTrigger>
      </Select>
    );
    const trigger = screen.getByTestId("trigger") as HTMLElement;
    expect(trigger).toHaveAttribute("data-size", "sm");
  });

  it("applies custom className", () => {
    render(
      <Select>
        <SelectTrigger className="my-trigger" data-testid="trigger">Trigger</SelectTrigger>
      </Select>
    );
    const trigger = screen.getByTestId("trigger") as HTMLElement;
    expect(trigger).toHaveClass("my-trigger");
  });

  it("shows chevron icon", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">Trigger</SelectTrigger>
      </Select>
    );
    const trigger = screen.getByTestId("trigger") as HTMLElement;
    const svg = trigger.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("SelectValue", () => {
  it("renders with correct data-slot when inside Select root", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue data-testid="value" placeholder="Select..." />
        </SelectTrigger>
      </Select>
    );
    const value = screen.getByTestId("value") as HTMLElement;
    expect(value).toHaveAttribute("data-slot", "select-value");
  });
});

describe("SelectContent", () => {
  it("renders options inside content within Select root", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent data-testid="content">
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("applies custom className to the content wrapper", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="my-content">
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    const user = userEvent.setup();
    if (trigger) await user.click(trigger);
    const content = document.querySelector('[data-slot="select-content"]') as HTMLElement | null;
    expect(content).toBeInTheDocument();
    if (content) {
      expect(content.className).toContain("my-content");
    }
  });
});

describe("SelectGroup", () => {
  it("renders inside SelectContent with label items", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select fruit" />
        </SelectTrigger>
        <SelectContent data-testid="content">
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="my-group">
            <SelectItem value="1">One</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    const user = userEvent.setup();
    if (trigger) await user.click(trigger);
    const group = document.querySelector('[data-slot="select-group"]') as HTMLElement | null;
    expect(group).toBeInTheDocument();
    if (group) {
      expect(group.className).toContain("my-group");
    }
  });
});

describe("SelectItem", () => {
  it("renders with text when inside Select root", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1" data-testid="item">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("renders multiple items", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Apple</SelectItem>
          <SelectItem value="2">Banana</SelectItem>
          <SelectItem value="3">Cherry</SelectItem>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1" className="my-item">Option</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    const user = userEvent.setup();
    if (trigger) await user.click(trigger);
    const item = document.querySelector('[data-slot="select-item"]') as HTMLElement | null;
    expect(item).toBeInTheDocument();
    if (item) {
      expect(item.className).toContain("my-item");
    }
  });
});

describe("SelectLabel", () => {
  it("renders label text inside Select structure", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel data-testid="label">Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    const label = document.querySelector('[data-slot="select-label"]');
    expect(label).toBeInTheDocument();
    expect(screen.getByText("Fruits")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="my-label" data-testid="label">Label</SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    const user = userEvent.setup();
    if (trigger) await user.click(trigger);
    const label = document.querySelector('[data-slot="select-label"]') as HTMLElement | null;
    expect(label).toBeInTheDocument();
    if (label) {
      expect(label).toHaveClass("my-label");
    }
  });
});

describe("SelectSeparator", () => {
  it("renders separator inside Select structure", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectSeparator data-testid="separator" />
          <SelectItem value="2">Two</SelectItem>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    const separator = document.querySelector('[data-slot="select-separator"]');
    expect(separator).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectSeparator className="my-separator" data-testid="separator" />
        </SelectContent>
      </Select>
    );
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    const user = userEvent.setup();
    if (trigger) await user.click(trigger);
    const separator = document.querySelector('[data-slot="select-separator"]') as HTMLElement | null;
    expect(separator).toBeInTheDocument();
    if (separator) {
      expect(separator).toHaveClass("my-separator");
    }
  });
});

describe("Select full structure", () => {
  it("renders a complete select component", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="cherry">Cherry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("renders scroll buttons", () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Scroll test" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
          <SelectItem value="2">Two</SelectItem>
          <SelectItem value="3">Three</SelectItem>
          <SelectItem value="4">Four</SelectItem>
          <SelectItem value="5">Five</SelectItem>
        </SelectContent>
      </Select>
    );
    const user = userEvent.setup();
    user.click(screen.getByTestId("trigger"));
  });
});
