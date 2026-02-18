import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  KEY_ENTER_COMMAND,
  LexicalEditor,
} from "lexical";
import { $isCodeNode } from "@lexical/code";
import {
  $findCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $isTableCellNode,
} from "@lexical/table";
import { $isQuoteNode } from "@lexical/rich-text";
import { BaseExtension } from "../base/BaseExtension";
import { ExtensionCategory } from "../types";

type EnterKeyBehaviorCommands = Record<string, never>;
type EnterKeyBehaviorStateQueries = Record<string, never>;

export class EnterKeyBehaviorExtension extends BaseExtension<
  "enterKeyBehavior",
  {},
  EnterKeyBehaviorCommands,
  EnterKeyBehaviorStateQueries
> {
  constructor() {
    super("enterKeyBehavior", [ExtensionCategory.Floating]);
    this.config = {
      ...(this.config || {}),
      showInToolbar: false,
      initPriority: 100,
    };
  }

  register(editor: LexicalEditor): () => void {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent | null) => {
        let handled = false;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }

          const anchorNode = selection.anchor.getNode();

          const tableCellNode = $findCellNode(anchorNode);
          if ($isTableCellNode(tableCellNode)) {
            if (event?.shiftKey) {
              const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
              const paragraphNode = $createParagraphNode();
              tableNode.insertAfter(paragraphNode);
              paragraphNode.selectStart();
              handled = true;
            }
            return;
          }

          const quoteNode = this.findQuoteNode(anchorNode);
          if (quoteNode) {
            if (event?.shiftKey) {
              const paragraphNode = $createParagraphNode();
              quoteNode.insertAfter(paragraphNode);
              paragraphNode.selectStart();
            } else {
              selection.insertLineBreak();
            }
            handled = true;
            return;
          }

          const codeNode = this.findCodeNode(anchorNode);
          if (codeNode && event?.shiftKey) {
            const paragraphNode = $createParagraphNode();
            codeNode.insertAfter(paragraphNode);
            paragraphNode.selectStart();
            handled = true;
            return;
          }
        });

        if (handled) {
          event?.preventDefault();
        }

        return handled;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }

  private findQuoteNode(node: any) {
    let current = node;
    while (current) {
      if ($isQuoteNode(current)) {
        return current;
      }
      current = current.getParent();
    }
    return null;
  }

  private findCodeNode(node: any) {
    let current = node;
    while (current) {
      if ($isCodeNode(current)) {
        return current;
      }
      current = current.getParent();
    }
    return null;
  }
}

export const enterKeyBehaviorExtension = new EnterKeyBehaviorExtension();
