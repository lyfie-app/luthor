import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { createExtensiveExtensions } from "../extensive";
import { NotesEditor } from "./NotesEditor";

export const notesPreset: EditorPreset = {
  id: "notes",
  label: "Notes",
  description: "Compact notes editor with title and actions.",
  extensions: createExtensiveExtensions({
    featureFlags: {
      list: true,
      image: false,
      table: false,
      iframeEmbed: false,
      youTubeEmbed: false,
      commandPalette: false,
      slashCommand: false,
      draggableBlock: false,
      customNode: false,
    },
  }),
  components: {
    Editor: NotesEditor,
  },
  toolbar: [],
  config: createPresetEditorConfig("notes", "Take a note..."),
  css: "notes/styles.css",
};
