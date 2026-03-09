// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { htmlToJSON, jsonToHTML } from "./html";

type JsonDocument = {
  root: {
    children: Array<Record<string, unknown>>;
  };
};

function getFirstText(document: JsonDocument): string {
  const paragraph = document.root.children[0] as {
    children?: Array<{ text?: string }>;
  };
  return paragraph.children?.[0]?.text ?? "";
}

describe("html bridge", () => {
  it("converts between HTML and JSON for basic content", () => {
    const json = htmlToJSON("<p>Hello HTML</p>") as JsonDocument;
    expect(getFirstText(json)).toBe("Hello HTML");

    const html = jsonToHTML(json);
    expect(html).toContain("Hello HTML");
  });

  it("preserves unsupported nodes via metadata envelopes", () => {
    const input = {
      root: {
        type: "root",
        version: 1,
        format: "",
        indent: 0,
        direction: null,
        children: [
          {
            type: "paragraph",
            version: 1,
            format: "",
            indent: 0,
            direction: null,
            children: [
              {
                type: "text",
                version: 1,
                text: "Before",
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
              },
            ],
          },
          {
            type: "featureCard",
            version: 1,
            payload: { title: "AI Draft" },
          },
        ],
      },
    };

    const html = jsonToHTML(input);
    expect(html).toContain("luthor:meta v1");

    const roundTrip = htmlToJSON(html) as JsonDocument;
    const restoredNode = roundTrip.root.children[1] as {
      type?: string;
      payload?: Record<string, unknown>;
    };
    expect(restoredNode.type).toBe("featureCard");
    expect(restoredNode.payload).toEqual({ title: "AI Draft" });
  });

  it("exports and re-imports image nodes natively", () => {
    const input = {
      root: {
        type: "root",
        version: 1,
        format: "",
        indent: 0,
        direction: null,
        children: [
          {
            type: "image",
            version: 1,
            src: "https://example.com/photo.jpg",
            alt: "Example",
            alignment: "center",
          },
        ],
      },
    };

    const html = jsonToHTML(input);
    expect(html).toContain("<img");

    const roundTrip = htmlToJSON(html) as JsonDocument;
    const imageNode = roundTrip.root.children[0] as {
      type?: string;
      src?: string;
      alt?: string;
    };
    expect(imageNode.type).toBe("image");
    expect(imageNode.src).toContain("https://example.com/photo.jpg");
    expect(imageNode.alt).toBe("Example");
  });
});
