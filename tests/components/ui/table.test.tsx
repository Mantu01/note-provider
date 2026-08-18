import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

describe("Table", () => {
  it("renders table element with correct data-slot", () => {
    const { container } = render(<Table data-testid="table" />);
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute("data-slot", "table");
  });

  it("wraps table in a div container with overflow-x-auto", () => {
    const { container } = render(<Table data-testid="table" />);
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe("DIV");
    expect(div).toHaveClass("relative", "w-full", "overflow-x-auto");
  });

  it("applies custom className to table", () => {
    const { container } = render(<Table className="my-table" data-testid="table" />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table).toHaveClass("my-table");
  });

  it("applies default table classes", () => {
    const { container } = render(<Table data-testid="table" />);
    const table = container.querySelector("table") as HTMLElement;
    expect(table).toHaveClass("w-full", "caption-bottom", "text-sm");
  });
});

describe("TableHeader", () => {
  it("renders thead element with correct data-slot", () => {
    const { container } = render(<TableHeader data-testid="header" />);
    const thead = container.firstChild as HTMLElement;
    expect(thead.tagName).toBe("THEAD");
    expect(thead).toHaveAttribute("data-slot", "table-header");
  });

  it("applies custom className", () => {
    const { container } = render(<TableHeader className="my-header" data-testid="header" />);
    const thead = container.firstChild as HTMLElement;
    expect(thead).toHaveClass("my-header");
  });
});

describe("TableBody", () => {
  it("renders tbody element with correct data-slot", () => {
    const { container } = render(<TableBody data-testid="body" />);
    const tbody = container.firstChild as HTMLElement;
    expect(tbody.tagName).toBe("TBODY");
    expect(tbody).toHaveAttribute("data-slot", "table-body");
  });

  it("applies custom className", () => {
    const { container } = render(<TableBody className="my-body" data-testid="body" />);
    const tbody = container.firstChild as HTMLElement;
    expect(tbody).toHaveClass("my-body");
  });
});

describe("TableFooter", () => {
  it("renders tfoot element with correct data-slot", () => {
    const { container } = render(<TableFooter data-testid="footer" />);
    const tfoot = container.firstChild as HTMLElement;
    expect(tfoot.tagName).toBe("TFOOT");
    expect(tfoot).toHaveAttribute("data-slot", "table-footer");
  });

  it("applies custom className", () => {
    const { container } = render(<TableFooter className="my-footer" data-testid="footer" />);
    const tfoot = container.firstChild as HTMLElement;
    expect(tfoot).toHaveClass("my-footer");
  });
});

describe("TableRow", () => {
  it("renders tr element with correct data-slot", () => {
    const { container } = render(<TableRow data-testid="row" />);
    const tr = container.firstChild as HTMLElement;
    expect(tr.tagName).toBe("TR");
    expect(tr).toHaveAttribute("data-slot", "table-row");
  });

  it("applies custom className", () => {
    const { container } = render(<TableRow className="my-row" data-testid="row" />);
    const tr = container.firstChild as HTMLElement;
    expect(tr).toHaveClass("my-row");
  });

  it("has border-b class by default", () => {
    const { container } = render(<TableRow data-testid="row" />);
    const tr = container.firstChild as HTMLElement;
    expect(tr).toHaveClass("border-b");
  });
});

describe("TableHead", () => {
  it("renders th element with correct data-slot", () => {
    const { container } = render(<TableHead data-testid="head">Name</TableHead>);
    const th = container.firstChild as HTMLElement;
    expect(th.tagName).toBe("TH");
    expect(th).toHaveAttribute("data-slot", "table-head");
    expect(th).toHaveTextContent("Name");
  });

  it("applies custom className", () => {
    const { container } = render(<TableHead className="my-head" data-testid="head">Name</TableHead>);
    const th = container.firstChild as HTMLElement;
    expect(th).toHaveClass("my-head");
  });

  it("has font-medium class by default", () => {
    const { container } = render(<TableHead data-testid="head">Name</TableHead>);
    const th = container.firstChild as HTMLElement;
    expect(th).toHaveClass("font-medium");
  });
});

describe("TableCell", () => {
  it("renders td element with correct data-slot", () => {
    const { container } = render(<TableCell data-testid="cell">Data</TableCell>);
    const td = container.firstChild as HTMLElement;
    expect(td.tagName).toBe("TD");
    expect(td).toHaveAttribute("data-slot", "table-cell");
    expect(td).toHaveTextContent("Data");
  });

  it("applies custom className", () => {
    const { container } = render(<TableCell className="my-cell" data-testid="cell">Data</TableCell>);
    const td = container.firstChild as HTMLElement;
    expect(td).toHaveClass("my-cell");
  });
});

describe("TableCaption", () => {
  it("renders caption element with correct data-slot", () => {
    const { container } = render(<TableCaption data-testid="caption">My Caption</TableCaption>);
    const caption = container.firstChild as HTMLElement;
    expect(caption.tagName).toBe("CAPTION");
    expect(caption).toHaveAttribute("data-slot", "table-caption");
    expect(caption).toHaveTextContent("My Caption");
  });

  it("applies custom className", () => {
    const { container } = render(<TableCaption className="my-caption" data-testid="caption">Caption</TableCaption>);
    const caption = container.firstChild as HTMLElement;
    expect(caption).toHaveClass("my-caption");
  });
});

describe("Table full structure", () => {
  it("renders a complete table with header and rows", () => {
    render(
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>alice@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText("A list of users")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("renders table with empty body", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody />
      </Table>
    );
    expect(screen.getByText("Column")).toBeInTheDocument();
  });

  it("renders table with only header and no body", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("applies data-slot attributes to all table parts", () => {
    render(
      <Table>
        <TableCaption>Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Col 1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Foot</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(document.querySelector('[data-slot="table"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-container"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-footer"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-row"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-head"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-cell"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="table-caption"]')).toBeInTheDocument();
  });
});
