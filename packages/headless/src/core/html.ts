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
