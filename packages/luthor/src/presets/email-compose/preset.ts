import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { createExtensiveExtensions } from "../extensive";
import { EmailComposeEditor } from "./EmailComposeEditor";

export const emailComposePreset: EditorPreset = {
  id: "email-compose",
  label: "Email Compose",
  description: "Compose shell with rich email body editing.",
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
    Editor: EmailComposeEditor,
  },
  toolbar: ["bold", "italic", "underline", "link", "unorderedList", "orderedList", "undo", "redo"],
  config: createPresetEditorConfig("email-compose", "Write your email..."),
  css: "email-compose/styles.css",
};
