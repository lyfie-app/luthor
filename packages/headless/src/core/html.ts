import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { QuoteNode, HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import {
  createEditor,
  $getRoot,
  ParagraphNode,
  TextNode,
  LineBreakNode,
  TabNode,
  type EditorState,
} from "lexical";
import { ImageNode, IframeEmbedNode, YouTubeEmbedNode } from "@lyfie/luthor-headless/extensions/media";
import {
  appendMetadataEnvelopes,
  extractMetadataEnvelopes,
  prepareDocumentForBridge,
  rehydrateDocumentFromEnvelopes,
  type JsonDocument,
} from "./metadata-envelope";

const HTML_SUPPORTED_NODE_TYPES = new Set<string>([
  "root",
  "paragraph",
  "text",
  "linebreak",
  "tab",
  "heading",
  "quote",
  "list",
  "listitem",
  "link",
  "autolink",
  "code",
  "code-highlight",
  "image",
  "iframe-embed",
  "youtube-embed",
]);

const RAW_TEXT_TAGS = new Set(["pre", "script", "style", "textarea"]);

function createHTMLEditor() {
  return createEditor({
    namespace: "luthor-html-converter",
    onError: (error) => {
      throw error;
    },
    nodes: [
      ParagraphNode,
      TextNode,
      LineBreakNode,
      TabNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
      ImageNode,
      IframeEmbedNode,
      YouTubeEmbedNode,
    ],
  });
}

function toEditorState(editor: ReturnType<typeof createHTMLEditor>, input: unknown): EditorState {
  const serialized = typeof input === "string" ? input : JSON.stringify(input ?? {});
  return editor.parseEditorState(serialized);
}

function assertDOMSupport(): void {
  if (
    typeof document === "undefined" ||
    typeof window === "undefined" ||
    typeof DOMParser === "undefined"
  ) {
    throw new Error(
      "HTML conversion requires browser DOM APIs (document/window/DOMParser).",
    );
  }
}

function hasWhitespacePreservingStyle(element: Element | null): boolean {
  if (!element) {
    return false;
  }

  const style = element.getAttribute("style");
  if (!style) {
    return false;
  }

  return /\bwhite-space\s*:\s*(pre|pre-wrap|pre-line)\b/i.test(style);
}

function isInsideRawTextContext(node: Node): boolean {
  let current = node.parentElement;
  while (current) {
    if (RAW_TEXT_TAGS.has(current.tagName.toLowerCase())) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function findAdjacentSignificantSibling(
  node: Text,
  direction: "previous" | "next",
): Node | null {
  let sibling = direction === "previous" ? node.previousSibling : node.nextSibling;
  while (sibling) {
    if (sibling.nodeType !== Node.TEXT_NODE) {
      return sibling;
    }

    const text = sibling.textContent ?? "";
    if (text.trim().length > 0) {
      return sibling;
    }

    sibling = direction === "previous" ? sibling.previousSibling : sibling.nextSibling;
  }

  return null;
}

function shouldCollapseToSingleSpace(previousText: string, nextText: string): boolean {
  if (!previousText || !nextText) {
    return false;
  }

  if (/\s$/.test(previousText) || /^\s/.test(nextText)) {
    return false;
  }

  const previousChar = previousText.at(-1) ?? "";
  const nextChar = nextText[0] ?? "";

  if (!previousChar || !nextChar) {
    return false;
  }

  if (/^[,.;:!?)]$/.test(nextChar) || /^[([{"']$/.test(previousChar)) {
    return false;
  }

  return true;
}

function normalizeWhitespaceArtifacts(parsedDocument: Document): void {
  const preWrapCandidates = Array.from(parsedDocument.querySelectorAll<HTMLElement>("[style]"));
  for (const element of preWrapCandidates) {
    if (!hasWhitespacePreservingStyle(element)) {
      continue;
    }

    if (element.childNodes.length !== 1 || element.firstChild?.nodeType !== Node.TEXT_NODE) {
      continue;
    }

    const textNode = element.firstChild as Text;
    if (!/[\r\n]/.test(textNode.data)) {
      continue;
    }

    textNode.data = textNode.data
      .replace(/^\s*\r?\n\s*/, "")
      .replace(/\r?\n\s*$/, "");
  }

  const walker = parsedDocument.createTreeWalker(parsedDocument.body, NodeFilter.SHOW_TEXT);
  const adjustments: Array<{ node: Text; replacement: string | null }> = [];
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const value = textNode.data;
    const parentElement = textNode.parentElement;

    if (
      !/^[\s\r\n\t]+$/.test(value) ||
      !/[\r\n]/.test(value) ||
      isInsideRawTextContext(textNode) ||
      hasWhitespacePreservingStyle(parentElement)
    ) {
      current = walker.nextNode();
      continue;
    }

    const previousSibling = findAdjacentSignificantSibling(textNode, "previous");
    const nextSibling = findAdjacentSignificantSibling(textNode, "next");
    const previousText = previousSibling?.textContent ?? "";
    const nextText = nextSibling?.textContent ?? "";

    if (shouldCollapseToSingleSpace(previousText, nextText)) {
      adjustments.push({ node: textNode, replacement: " " });
    } else {
      adjustments.push({ node: textNode, replacement: null });
    }

    current = walker.nextNode();
  }

  for (const adjustment of adjustments) {
    if (!adjustment.node.parentNode) {
      continue;
    }

    if (adjustment.replacement === null) {
      adjustment.node.parentNode.removeChild(adjustment.node);
      continue;
    }

    adjustment.node.data = adjustment.replacement;
  }
}

export function htmlToJSON(html: string): JsonDocument {
  assertDOMSupport();
  const { content, envelopes, warnings } = extractMetadataEnvelopes(html);
  for (const warning of warnings) {
    console.warn(`[luthor-headless] ${warning}`);
  }

  const editor = createHTMLEditor();
  editor.update(
    () => {
      const parsedDocument = new DOMParser().parseFromString(content, "text/html");
      normalizeWhitespaceArtifacts(parsedDocument);
      const nodes = $generateNodesFromDOM(editor, parsedDocument);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    },
    { discrete: true },
  );

  const baseDocument = editor.getEditorState().toJSON() as JsonDocument;
  return rehydrateDocumentFromEnvelopes(baseDocument, envelopes);
}

export function jsonToHTML(input: unknown): string {
  assertDOMSupport();
  const prepared = prepareDocumentForBridge(input, {
    mode: "html",
    supportedNodeTypes: HTML_SUPPORTED_NODE_TYPES,
  });
  const editor = createHTMLEditor();
  const editorState = toEditorState(editor, prepared.document);
  editor.setEditorState(editorState, { tag: "history-merge" });

  const html = editorState.read(() => {
    return $generateHtmlFromNodes(editor, null);
  });

  return appendMetadataEnvelopes(html, prepared.envelopes);
}
