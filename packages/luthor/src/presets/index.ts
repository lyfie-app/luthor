import type {
	EditorConfig,
	Extension,
	LuthorTheme,
} from "@lyfie/luthor-headless";
import { extensivePreset, ExtensiveEditor, extensiveExtensions } from "./extensive";
import type { ExtensiveEditorMode, ExtensiveEditorProps, ExtensiveEditorRef } from "./extensive";
export { createPresetEditorConfig } from "../core/preset-config";

export interface EditorPreset {
	id: string;
	label: string;
	description?: string;
	extensions?: Extension[];
	config?: EditorConfig;
	theme?: LuthorTheme;
	toolbar?: string[];
	components?: Record<string, unknown>;
	css?: string;
}

export {
	extensivePreset,
	ExtensiveEditor,
	extensiveExtensions,
};

export type {
	ExtensiveEditorMode,
	ExtensiveEditorProps,
	ExtensiveEditorRef,
};

export const presetRegistry: Record<string, EditorPreset> = {
	extensive: extensivePreset,
};
