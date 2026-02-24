import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { createExtensiveExtensions } from "../extensive";
import { SimpleTextEditor } from "./SimpleTextEditor";

export const simpleTextPreset: EditorPreset = {
  id: "simple-text",
  label: "Simple Text",
  description: "Plain text writing with rich formatting disabled.",
  extensions: createExtensiveExtensions({
    featureFlags: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      link: false,
      list: false,
      blockFormat: false,
      image: false,
      table: false,
      code: false,
      codeFormat: false,
      commandPalette: false,
      slashCommand: false,
      emoji: false,
      draggableBlock: false,
    },
  }),
  components: {
    Editor: SimpleTextEditor,
  },
  toolbar: [],
  config: createPresetEditorConfig("simple-text", "Write plain text..."),
  css: "simple-text/styles.css",
};
