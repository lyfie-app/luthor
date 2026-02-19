import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { extensiveExtensions, extensiveToolbar } from "../extensive";
import { NotionEditor } from "./NotionEditor";

export const notionPreset: EditorPreset = {
  id: "notion",
  label: "Notion",
  description: "Block-focused writing experience inspired by clean document tooling.",
  extensions: [...extensiveExtensions],
  components: {
    Editor: NotionEditor,
  },
  toolbar: [...extensiveToolbar],
  config: createPresetEditorConfig("notion", "Type '/' for commands..."),
  css: "notion/styles.css",
};
