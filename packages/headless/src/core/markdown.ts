import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { QuoteNode, HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import {
  createEditor,
  ParagraphNode,
  TextNode,
  LineBreakNode,
  TabNode,
  type EditorState,
} from "lexical";
import { ImageNode, IMAGE_MARKDOWN_TRANSFORMER } from "@lyfie/luthor-headless/extensions/media";
import {
  appendMetadataEnvelopes,
  extractMetadataEnvelopes,
  prepareDocumentForBridge,
  rehydrateDocumentFromEnvelopes,
  type JsonDocument,
} from "./metadata-envelope";

export type { JsonDocument } from "./metadata-envelope";

const MARKDOWN_TRANSFORMERS = [...TRANSFORMERS, IMAGE_MARKDOWN_TRANSFORMER];
const MARKDOWN_SUPPORTED_NODE_TYPES = new Set<string>([
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
]);

function createMarkdownEditor() {
  return createEditor({
    namespace: "luthor-markdown-converter",
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
    ],
  });
}

function toEditorState(editor: ReturnType<typeof createMarkdownEditor>, input: unknown): EditorState {
  const serialized = typeof input === "string" ? input : JSON.stringify(input ?? {});
  return editor.parseEditorState(serialized);
}

export function markdownToJSON(markdown: string): JsonDocument {
  const { content, envelopes, warnings } = extractMetadataEnvelopes(markdown);
  for (const warning of warnings) {
    console.warn(`[luthor-headless] ${warning}`);
  }

  const editor = createMarkdownEditor();
  editor.update(
    () => {
      $convertFromMarkdownString(content, MARKDOWN_TRANSFORMERS);
    },
    { discrete: true },
  );

  const baseDocument = editor.getEditorState().toJSON() as JsonDocument;
  return rehydrateDocumentFromEnvelopes(baseDocument, envelopes);
}

export function jsonToMarkdown(input: unknown): string {
  const prepared = prepareDocumentForBridge(input, {
    mode: "markdown",
    supportedNodeTypes: MARKDOWN_SUPPORTED_NODE_TYPES,
  });
  const editor = createMarkdownEditor();
  const editorState = toEditorState(editor, prepared.document);
  editor.setEditorState(editorState, { tag: "history-merge" });

  const markdown = editorState.read(() => {
    return $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
  });

  return appendMetadataEnvelopes(markdown, prepared.envelopes);
}
