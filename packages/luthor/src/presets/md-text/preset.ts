import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { createExtensiveExtensions } from "../extensive";
import { MDTextEditor } from "./MDTextEditor";

export const mdTextPreset: EditorPreset = {
  id: "md-text",
  label: "MD Text",
  description: "Visual and markdown editing with conversion bridge.",
  extensions: createExtensiveExtensions({
    featureFlags: {
      table: false,
      image: false,
      iframeEmbed: false,
      youTubeEmbed: false,
      customNode: false,
    },
  }),
  components: {
    Editor: MDTextEditor,
  },
  toolbar: ["bold", "italic", "underline", "strikethrough", "link", "unorderedList", "orderedList"],
  config: createPresetEditorConfig("md-text", "Write markdown..."),
  css: "md-text/styles.css",
};
