import { describe, expect, it } from "vitest";
import { jsonToMarkdown, markdownToJSON } from "./markdown";

type JsonDocument = {
  root: {
    children: Array<Record<string, unknown>>;
  };
};

function createSimpleDocument(text: string): Record<string, unknown> {
  return {
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
              text,
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
            },
          ],
        },
      ],
    },
  };
}

function getFirstText(document: JsonDocument): string {
  const paragraph = document.root.children[0] as {
    children?: Array<{ text?: string }>;
  };
  return paragraph.children?.[0]?.text ?? "";
}

describe("markdown bridge", () => {
  it("keeps simple markdown/json conversion stable", () => {
    const markdown = jsonToMarkdown(createSimpleDocument("Hello Markdown"));
    expect(markdown).toContain("Hello Markdown");

    const roundTrip = markdownToJSON(markdown) as JsonDocument;
    expect(getFirstText(roundTrip)).toBe("Hello Markdown");
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

    const markdown = jsonToMarkdown(input);
    expect(markdown).toContain("luthor:meta v1");

    const roundTrip = markdownToJSON(markdown) as JsonDocument;
    const restoredNode = roundTrip.root.children[1] as {
      type?: string;
      payload?: Record<string, unknown>;
    };
    expect(restoredNode.type).toBe("featureCard");
    expect(restoredNode.payload).toEqual({ title: "AI Draft" });
  });

  it("ignores malformed metadata comments without failing import", () => {
    const markdown = "Hello\n\n<!-- luthor:meta v1 {bad-json} -->";
    const document = markdownToJSON(markdown) as JsonDocument;
    expect(getFirstText(document)).toBe("Hello");
  });
});
