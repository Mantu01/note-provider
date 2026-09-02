import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  GithubIcon,
  XIcon,
  InstagramIcon,
  YouTubeIcon,
} from "@/components/shared/social-icons";

describe("Social Icons", () => {
  it("GithubIcon renders an SVG with github path", () => {
    const { container } = render(<GithubIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("width")).toBe("24");
  });

  it("XIcon renders an SVG", () => {
    const { container } = render(<XIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("InstagramIcon renders an SVG", () => {
    const { container } = render(<InstagramIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("YouTubeIcon renders an SVG with play triangle", () => {
    const { container } = render(<YouTubeIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("icons accept custom size prop", () => {
    const { container } = render(<GithubIcon size={48} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("48");
  });

  it("icons accept custom className prop", () => {
    const { container } = render(<XIcon className="text-primary" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-primary");
  });
});
