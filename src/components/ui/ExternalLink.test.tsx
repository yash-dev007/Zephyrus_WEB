import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "@/components/ui/ExternalLink";

describe("ExternalLink", () => {
  it("opens outbound links safely in a new tab", () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>);

    const link = screen.getByRole("link", { name: /example/i });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("announces that a new tab will open", () => {
    render(<ExternalLink href="https://example.com">Example</ExternalLink>);
    expect(screen.getByText("(opens in a new tab)")).toHaveClass("sr-only");
  });

  it("optionally renders a north-east arrow", () => {
    const { container } = render(
      <ExternalLink href="https://example.com" showArrow className="footer-btn">
        Example
      </ExternalLink>,
    );

    expect(container.querySelector("svg.arrow-ne")).not.toBeNull();
    expect(screen.getByRole("link")).toHaveClass("footer-btn");
  });
});
