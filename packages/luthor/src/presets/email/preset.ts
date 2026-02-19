import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { extensiveExtensions, extensiveToolbar } from "../extensive";
import { EmailEditor } from "./EmailEditor";

export const emailPreset: EditorPreset = {
  id: "email",
  label: "Email",
  description: "Email drafting surface focused on visual and HTML source workflows.",
  extensions: [...extensiveExtensions],
  components: {
    Editor: EmailEditor,
  },
  toolbar: [...extensiveToolbar],
  config: createPresetEditorConfig("email", "Write an email..."),
  css: "email/styles.css",
};
