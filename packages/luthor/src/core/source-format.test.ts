import { describe, expect, it } from "vitest";
import { formatHTMLSource, formatMarkdownSource } from "./source-format";

describe("formatMarkdownSource", () => {
  it("decodes lexical whitespace entities in markdown output", () => {
    expect(formatMarkdownSource("This is a **bold&#32;**line")).toBe("This is a **bold** line");
  });

  it("handles whitespace entities for multiple text formats", () => {
    expect(formatMarkdownSource("*it&#32;*x ~~st&#32;~~y")).toBe("*it* x ~~st~~ y");
  });

  it("normalizes marker-contained spaces without entities", () => {
    expect(formatMarkdownSource("Let's **test **this")).toBe("Let's **test** this");
  });
});

describe("formatHTMLSource", () => {
  it("normalizes line breaks and trims output", () => {
    expect(formatHTMLSource(" <p>Hello</p>\r\n\r\n")).toBe("<p>\n  Hello\n</p>");
  });

  it("pretty prints compact html into multiple lines", () => {
    expect(formatHTMLSource("<div><p>Hello</p><p>World</p></div>")).toBe(
      "<div>\n  <p>\n    Hello\n  </p>\n  <p>\n    World\n  </p>\n</div>",
    );
  });
});
