import type { EditorPreset } from "..";
import { createPresetEditorConfig } from "../../core/preset-config";
import { extensiveExtensions, extensiveToolbar } from "../extensive";
import { ChatEditor } from "./ChatEditor";

export const chatPreset: EditorPreset = {
  id: "chat",
  label: "Chat",
  description: "Conversation-first editor with compact spacing and fast markdown fallback.",
  extensions: [...extensiveExtensions],
  components: {
    Editor: ChatEditor,
  },
  toolbar: [...extensiveToolbar],
  config: createPresetEditorConfig("chat", "Write a message..."),
  css: "chat/styles.css",
};
