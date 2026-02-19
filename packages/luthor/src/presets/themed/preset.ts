import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { extensiveExtensions, extensiveToolbar } from "../extensive";
import { ThemedEditor } from "./ThemedEditor";

export const themedPreset: EditorPreset = {
  id: "themed",
  label: "Themed",
  description: "Theme-token driven preset intended for broad UI customization.",
  extensions: [...extensiveExtensions],
  components: {
    Editor: ThemedEditor,
  },
  toolbar: [...extensiveToolbar],
  config: createPresetEditorConfig("themed", "Start writing with theme tokens..."),
  css: "themed/styles.css",
};
