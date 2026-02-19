import type {
	EditorConfig,
	Extension,
	LuthorTheme,
} from "@lyfie/luthor-headless";
import { ChatEditor, chatPreset } from "./chat";
import type { ChatEditorProps } from "./chat";
import { EmailEditor, emailPreset } from "./email";
import type { EmailEditorProps } from "./email";
import { extensivePreset, ExtensiveEditor, extensiveExtensions } from "./extensive";
import type { ExtensiveEditorMode, ExtensiveEditorProps, ExtensiveEditorRef } from "./extensive";
import { HtmlVisualEditor, htmlVisualPreset } from "./html-visual";
import type { HtmlVisualEditorProps } from "./html-visual";
import { MarkdownVisualEditor, markdownVisualPreset } from "./markdown-visual";
import type { MarkdownVisualEditorProps } from "./markdown-visual";
import { NotionEditor, notionPreset } from "./notion";
import type { NotionEditorProps } from "./notion";
import { ThemedEditor, themedPreset } from "./themed";
import type { ThemedEditorProps } from "./themed";
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
	chatPreset,
	ChatEditor,
	emailPreset,
	EmailEditor,
	markdownVisualPreset,
	MarkdownVisualEditor,
	htmlVisualPreset,
	HtmlVisualEditor,
	themedPreset,
	ThemedEditor,
	notionPreset,
	NotionEditor,
	extensivePreset,
	ExtensiveEditor,
	extensiveExtensions,
};

export type {
	ChatEditorProps,
	EmailEditorProps,
	MarkdownVisualEditorProps,
	HtmlVisualEditorProps,
	ThemedEditorProps,
	NotionEditorProps,
	ExtensiveEditorMode,
	ExtensiveEditorProps,
	ExtensiveEditorRef,
};

export const presetRegistry: Record<string, EditorPreset> = {
	chat: chatPreset,
	email: emailPreset,
	markdownVisual: markdownVisualPreset,
	htmlVisual: htmlVisualPreset,
	themed: themedPreset,
	notion: notionPreset,
	extensive: extensivePreset,
};
