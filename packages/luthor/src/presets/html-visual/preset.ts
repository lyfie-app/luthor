import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { extensiveExtensions, extensiveToolbar } from "../extensive";
import { HtmlVisualEditor } from "./HtmlVisualEditor";

export const htmlVisualPreset: EditorPreset = {
  id: "htmlVisual",
  label: "HTML / Visual",
  description: "HTML source-first editor with visual rendering workflow.",
  extensions: [...extensiveExtensions],
  components: {
    Editor: HtmlVisualEditor,
  },
  toolbar: [...extensiveToolbar],
  config: createPresetEditorConfig("html-visual", "Compose with HTML preview..."),
  css: "html-visual/styles.css",
};
