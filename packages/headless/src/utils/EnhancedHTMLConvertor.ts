import { $generateNodesFromDOM } from "@lexical/html";
import {
  $createParagraphNode,
  $getRoot,
  LexicalEditor,
  type SerializedEditorState,
  type SerializedLexicalNode,
} from "lexical";

type EnhancedHTMLMetadata = {
  version: 1;
  htmlHash: string;
  editorState: SerializedEditorState<SerializedLexicalNode>;
};

const ENHANCED_HTML_PREFIX = "LUTHOR_STATE:";
const ENHANCED_HTML_REGEX = /<!--\s*LUTHOR_STATE:([A-Za-z0-9+/=_-]+)\s*-->/g;

function normalizeForHash(input: string): string {
  return input.replace(/\r\n?/g, "\n").trim();
}

function hashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function encodeBase64(value: string): string {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(value)));
  }

  if (typeof globalThis !== "undefined" && "Buffer" in globalThis) {
    return (globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer.from(
      value,
      "utf-8",
    ).toString("base64");
  }

  throw new Error("No base64 encoder available in this environment");
}

function decodeBase64(value: string): string | null {
  try {
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      return decodeURIComponent(
        Array.from(window.atob(value))
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join(""),
      );
    }

    if (typeof globalThis !== "undefined" && "Buffer" in globalThis) {
      return (
        globalThis as typeof globalThis & { Buffer: typeof Buffer }
      ).Buffer.from(value, "base64").toString("utf-8");
    }

    return null;
  } catch {
    return null;
  }
}

function isSerializedEditorState(
  value: unknown,
): value is SerializedEditorState<SerializedLexicalNode> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeState = value as { root?: { children?: unknown } };
  return Array.isArray(maybeState.root?.children);
}

function parseEnhancedHTMLMetadata(html: string): EnhancedHTMLMetadata | null {
  const matches = Array.from(html.matchAll(ENHANCED_HTML_REGEX));
  const lastMatch = matches.length > 0 ? matches[matches.length - 1] : null;
  if (!lastMatch || !lastMatch[1]) {
    return null;
  }

  const decoded = decodeBase64(lastMatch[1]);
  if (!decoded) {
    return null;
  }

  try {
    const parsed = JSON.parse(decoded) as Partial<EnhancedHTMLMetadata>;
    if (
      parsed.version !== 1 ||
      typeof parsed.htmlHash !== "string" ||
      !isSerializedEditorState(parsed.editorState)
    ) {
      return null;
    }

    return {
      version: 1,
      htmlHash: parsed.htmlHash,
      editorState: parsed.editorState,
    };
  } catch {
    return null;
  }
}

export function stripEnhancedHTMLMetadata(html: string): string {
  return html.replace(ENHANCED_HTML_REGEX, "").trim();
}

export function appendEnhancedHTMLMetadata(
  html: string,
  editorState: SerializedEditorState<SerializedLexicalNode>,
): string {
  const cleanedHtml = stripEnhancedHTMLMetadata(html);
  const metadata: EnhancedHTMLMetadata = {
    version: 1,
    htmlHash: hashString(normalizeForHash(cleanedHtml)),
    editorState,
  };

  const encoded = encodeBase64(JSON.stringify(metadata));
  const marker = `<!--${ENHANCED_HTML_PREFIX}${encoded}-->`;

  return cleanedHtml ? `${cleanedHtml}\n${marker}` : marker;
}

export function preprocessHTMLForCodeBlocks(html: string): string {
  return stripEnhancedHTMLMetadata(html);
}

export function postprocessCodeBlocks(rootElement: HTMLElement): void {
  void rootElement;
}

export function enhancedHTMLToLexicalJSON(
  html: string,
): SerializedEditorState<SerializedLexicalNode> | null {
  const metadata = parseEnhancedHTMLMetadata(html);
  if (!metadata) {
    return null;
  }

  const cleanedHtml = stripEnhancedHTMLMetadata(html);
  const incomingHash = hashString(normalizeForHash(cleanedHtml));

  if (metadata.htmlHash !== incomingHash) {
    return null;
  }

  return metadata.editorState;
}

export async function importHTMLWithCodeSupport(
  html: string,
  editor: LexicalEditor,
  importApi: { fromJSON: (json: unknown) => void },
  opts?: { preventFocus?: boolean },
): Promise<void> {
  const lexicalState = enhancedHTMLToLexicalJSON(html);
  if (lexicalState) {
    importApi.fromJSON(lexicalState);
    return;
  }

  const cleanedHtml = preprocessHTMLForCodeBlocks(html);

  return new Promise<void>((resolve) => {
    editor.update(
      () => {
        try {
          const root = $getRoot();
          root.clear();

          if (!cleanedHtml.trim()) {
            root.append($createParagraphNode());
          } else {
            const parser = new DOMParser();
            const doc = parser.parseFromString(cleanedHtml, "text/html");
            const nodes = $generateNodesFromDOM(editor, doc);

            if (nodes.length > 0) {
              root.append(...nodes);
            } else {
              root.append($createParagraphNode());
            }
          }

          if (!opts?.preventFocus) {
            $getRoot().selectEnd();
          }
        } catch {
          const root = $getRoot();
          root.clear();
          root.append($createParagraphNode());
        }
      },
      { discrete: true, onUpdate: resolve },
    );
  });
}
