import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  GithubIcon,
  GoogleIcon,
  XIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
  AppleIcon,
  MicrosoftIcon,
  LeetCodeIcon,
  YouTubeIcon,
} from "@/components/shared/social-icons";

describe("Social Icons", () => {
  it("GithubIcon renders an SVG with github path", () => {
    const { container } = render(<GithubIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute("width")).toBe("24");
  });

  it("GoogleIcon renders an SVG with colored paths", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("XIcon renders an SVG", () => {
    const { container } = render(<XIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("LinkedinIcon renders an SVG with blue fill", () => {
    const { container } = render(<LinkedinIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("FacebookIcon renders an SVG", () => {
    const { container } = render(<FacebookIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("InstagramIcon renders an SVG", () => {
    const { container } = render(<InstagramIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("AppleIcon renders an SVG", () => {
    const { container } = render(<AppleIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("MicrosoftIcon renders an SVG with four colored paths", () => {
    const { container } = render(<MicrosoftIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelectorAll("path").length).toBe(4);
  });

  it("LeetCodeIcon renders an SVG", () => {
    const { container } = render(<LeetCodeIcon />);
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
