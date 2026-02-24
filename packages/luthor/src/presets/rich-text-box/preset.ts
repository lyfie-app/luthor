import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { createExtensiveExtensions } from "../extensive";
import { RichTextBoxEditor } from "./RichTextBoxEditor";

export const richTextBoxPreset: EditorPreset = {
  id: "rich-text-box",
  label: "Rich Text Box",
  description: "Inline formatting and list-focused rich text editing.",
  extensions: createExtensiveExtensions({
    featureFlags: {
      image: false,
      table: false,
      iframeEmbed: false,
      youTubeEmbed: false,
      emoji: false,
      commandPalette: false,
      slashCommand: false,
      draggableBlock: false,
    },
  }),
  components: {
    Editor: RichTextBoxEditor,
  },
  toolbar: ["bold", "italic", "underline", "strikethrough", "unorderedList", "orderedList", "checkList", "undo", "redo"],
  config: createPresetEditorConfig("rich-text-box", "Write rich text..."),
  css: "rich-text-box/styles.css",
};
