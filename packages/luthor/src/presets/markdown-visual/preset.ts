import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { extensiveExtensions, extensiveToolbar } from "../extensive";
import { MarkdownVisualEditor } from "./MarkdownVisualEditor";

export const markdownVisualPreset: EditorPreset = {
  id: "markdownVisual",
  label: "Markdown / Visual",
  description: "Markdown-first editor with visual round-trip mode.",
  extensions: [...extensiveExtensions],
  components: {
    Editor: MarkdownVisualEditor,
  },
  toolbar: [...extensiveToolbar],
  config: createPresetEditorConfig("markdown-visual", "Write in markdown..."),
  css: "markdown-visual/styles.css",
};
