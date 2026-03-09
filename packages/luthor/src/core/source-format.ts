function normalizeLineBreaks(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function decodeMarkdownWhitespaceEntities(input: string): string {
  return input.replace(/&#(9|10|13|32|160);/g, (_match, code) => {
    switch (code) {
      case "9":
        return "\t";
      case "10":
        return "\n";
      case "13":
        return "\r";
      case "32":
        return " ";
      case "160":
        return " ";
      default:
        return _match;
    }
  });
}

function moveWhitespaceOutsideMarker(input: string, marker: string): string {
  const escaped = marker.replace(/([*~])/g, "\\$1");

  let output = input;
  // Move leading whitespace outside markers: ** text** ->  **text**
  output = output.replace(
    new RegExp(`${escaped}(\\s+)([^\\n]+?)${escaped}`, "g"),
    (_match, leading, content) => `${leading}${marker}${content}${marker}`,
  );
  // Move trailing whitespace outside markers: **text ** -> **text** 
  output = output.replace(
    new RegExp(`${escaped}([^\\n]+?)(\\s+)${escaped}`, "g"),
    (_match, content, trailing) => `${marker}${content}${marker}${trailing}`,
  );

  return output;
}

function normalizeInlineMarkdownWhitespace(input: string): string {
  const markers = ["***", "**", "~~", "*"];
  return markers.reduce((value, marker) => moveWhitespaceOutsideMarker(value, marker), input);
}

const VOID_HTML_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const RAW_TEXT_TAGS = new Set(["pre", "script", "style", "textarea"]);

function parseTagName(token: string): string | null {
  const match = token.match(/^<\/?\s*([^\s/>]+)/i);
  if (!match || !match[1]) {
    return null;
  }
  return match[1].toLowerCase();
}

function prettyPrintHTML(input: string): string {
  const tokens = input.match(/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[A-Za-z][^>]*>|[^<]+/gi) ?? [input];
  const lines: string[] = [];
  let indent = 0;
  let rawTextTag: string | null = null;

  const pad = () => "  ".repeat(Math.max(indent, 0));

  for (const rawToken of tokens) {
    const token = rawToken.trim();
    if (!token) {
      continue;
    }

    if (rawTextTag) {
      const closingName = parseTagName(token);
      const isClosingRawTag = token.startsWith("</") && closingName === rawTextTag;
      if (isClosingRawTag) {
        indent = Math.max(indent - 1, 0);
        lines.push(`${pad()}${token}`);
        rawTextTag = null;
        continue;
      }

      lines.push(`${pad()}${token}`);
      continue;
    }

    const isTag = token.startsWith("<") && token.endsWith(">");
    if (!isTag) {
      lines.push(`${pad()}${token.replace(/\s+/g, " ").trim()}`);
      continue;
    }

    const tagName = parseTagName(token);
    const isClosingTag = token.startsWith("</");
    const isSelfClosingTag =
      token.endsWith("/>") || (tagName ? VOID_HTML_TAGS.has(tagName) : false);

    if (isClosingTag) {
      indent = Math.max(indent - 1, 0);
      lines.push(`${pad()}${token}`);
      continue;
    }

    lines.push(`${pad()}${token}`);

    if (!isSelfClosingTag) {
      if (tagName && RAW_TEXT_TAGS.has(tagName)) {
        rawTextTag = tagName;
      }
      indent += 1;
    }
  }

  return lines.join("\n");
}

export function formatJSONSource(input: string): string {
  const normalized = normalizeLineBreaks(input).trim();
  if (!normalized) {
    return "";
  }

  try {
    const parsed = JSON.parse(normalized);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return normalized;
  }
}

export function formatMarkdownSource(input: string): string {
  return normalizeInlineMarkdownWhitespace(decodeMarkdownWhitespaceEntities(normalizeLineBreaks(input))).trim();
}

export function formatHTMLSource(input: string): string {
  const normalized = normalizeLineBreaks(input).trim();
  if (!normalized) {
    return "";
  }

  try {
    return prettyPrintHTML(normalized);
  } catch {
    return normalized;
  }
}
