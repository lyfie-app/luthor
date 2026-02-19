import { LexicalEditor } from "lexical";
import { BaseExtension } from "@lyfie/luthor-headless/extensions/base";
import { ExtensionCategory } from "@lyfie/luthor-headless/extensions/types";
import { ReactNode } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $createParagraphNode,
  $getRoot,
  type SerializedEditorState,
  type SerializedLexicalNode,
} from "lexical";
import {
  appendEnhancedHTMLMetadata,
  importHTMLWithCodeSupport,
} from "../../utils/EnhancedHTMLConvertor";

/**
 * Commands exposed by the HTML extension.
 */
export type HTMLCommands = {
  /** Export current editor content as an HTML string */
  exportToHTML: () => string;
  /** Import HTML into the editor, replacing current content */
  importFromHTML: (html: string, opts?: { preventFocus?: boolean }) => Promise<void>;
};

/**
 * State queries exposed by the HTML extension.
 */
export type HTMLStateQueries = {
  /** Check whether HTML export is available (always true) */
  canExportHTML: () => Promise<boolean>;
};

/**
 * HTML extension for import/export of HTML content.
 * Converts between Lexical editor state and HTML strings.
 *
 * @example
 * ```tsx
 * const extensions = [htmlExtension] as const;
 * const { Provider, useEditor } = createEditorSystem<typeof extensions>();
 *
 * function MyEditor() {
 *   const { commands } = useEditor();
 *
 *   const handleExport = () => {
 *     const html = commands.exportToHTML();
 *     console.log('Exported HTML:', html);
 *   };
 *
 *   const handleImport = () => {
 *     const html = '<p>Hello <strong>world</strong>!</p>';
 *     commands.importFromHTML(html);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleExport}>Export HTML</button>
 *       <button onClick={handleImport}>Import HTML</button>
 *     </div>
 *   );
 * }
 * ```
 */
export class HTMLExtension extends BaseExtension<
  "html",
  Record<string, never>,
  HTMLCommands,
  HTMLStateQueries,
  ReactNode[]
> {
  /**
   * Creates a new HTML extension.
   */
  constructor() {
    super("html", [ExtensionCategory.Toolbar]);
  }

  /**
   * Registers the extension with the Lexical editor.
   * No special registration needed for HTML functionality.
   *
   * @param editor - Lexical editor instance
   * @returns Cleanup function
   */
  register(editor: LexicalEditor): () => void {
    void editor;
    return () => {
      // Cleanup if needed
    };
  }

  /**
   * Returns commands exposed by this extension.
   *
   * @param editor - Lexical editor instance
   * @returns Object containing HTML import/export commands
   */
  getCommands(editor: LexicalEditor): HTMLCommands {
    return {
      exportToHTML: () => {
        return editor.getEditorState().read(() => {
          const html = $generateHtmlFromNodes(editor);
          return appendEnhancedHTMLMetadata(html, editor.getEditorState().toJSON());
        });
      },

      importFromHTML: (html: string, opts?: { preventFocus?: boolean }) => {
        return importHTMLWithCodeSupport(
          html,
          editor,
          {
            fromJSON: (json: unknown) => {
              if (typeof json === "string" || (typeof json === "object" && json !== null)) {
                editor.setEditorState(
                  editor.parseEditorState(
                    json as string | SerializedEditorState<SerializedLexicalNode>,
                  ),
                );
              }
            },
          },
          opts,
        ).catch((error) => {
          console.error("Error importing HTML:", error);
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            root.append($createParagraphNode());
          });
        });
      },
    };
  }

  /**
   * Returns state query functions for this extension.
   *
   * @param editor - Lexical editor instance
   * @returns Object containing state query functions
   */
  getStateQueries(editor: LexicalEditor): HTMLStateQueries {
    void editor;
    return {
      canExportHTML: async () => true,
    };
  }
}

/**
 * Preconfigured HTML extension instance.
 * Ready for use in extension arrays.
 */
export const htmlExtension = new HTMLExtension();

