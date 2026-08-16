import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderOpen } from "lucide-react";

describe("EmptyState", () => {
  it("renders with default icon", () => {
    render(<EmptyState title="No Notes" description="Add your first note to get started." />);
    expect(screen.getByText("No Notes")).toBeInTheDocument();
    expect(screen.getByText("Add your first note to get started.")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    render(
      <EmptyState
        icon={FolderOpen}
        title="No Folders"
        description="No folders yet."
      />
    );
    expect(screen.getByText("No Folders")).toBeInTheDocument();
    expect(screen.getByText("No folders yet.")).toBeInTheDocument();
  });

  it("applies min-h-64 and border classes to the container", () => {
    const { container } = render(
      <EmptyState title="Test" description="Test description" />
    );
    const empty = container.firstChild as HTMLElement;
    expect(empty).toHaveClass("min-h-64");
    expect(empty).toHaveClass("border");
  });

  it("renders title and description inside header", () => {
    render(
      <EmptyState
        title="My Title"
        description="My description text"
      />
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My description text")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(
      <EmptyState
        title="No Data"
        description="No data available"
        action={<button>Add Data</button>}
      />
    );
    expect(screen.getByText("Add Data")).toBeInTheDocument();
  });

  it("does not render action section when action is not provided", () => {
    const { container } = render(
      <EmptyState
        title="No Data"
        description="No data available"
      />
    );
    expect(container.querySelector('[data-slot="empty-content"]')).not.toBeInTheDocument();
  });

  it("does not render empty media when icon is null", () => {
    const { container } = render(
      <EmptyState
        title="No Data"
        description="No data available"
        icon={null as unknown as typeof FolderOpen}
      />
    );
    expect(container.querySelector('[data-slot="empty-icon"]')).not.toBeInTheDocument();
  });
});
