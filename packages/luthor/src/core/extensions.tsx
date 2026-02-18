import { createElement, type ComponentType } from "react";
import { FloatingToolbarExtension } from "@lyfie/luthor-headless";
import { FloatingToolbar } from "./floating-toolbar";
import type { CoreEditorActiveStates, CoreEditorCommands, CoreTheme } from "./types";

type FloatingToolbarContext = {
  commands: CoreEditorCommands;
  activeStates: CoreEditorActiveStates;
  editorTheme: CoreTheme;
};

const floatingToolbarContext: FloatingToolbarContext = {
  commands: {} as CoreEditorCommands,
  activeStates: {},
  editorTheme: "light",
};

export function setFloatingToolbarContext(
  commands: CoreEditorCommands,
  activeStates: CoreEditorActiveStates,
  editorTheme: CoreTheme,
) {
  floatingToolbarContext.commands = commands;
  floatingToolbarContext.activeStates = activeStates;
  floatingToolbarContext.editorTheme = editorTheme;
}

export function createFloatingToolbarExtension() {
  const FloatingToolbarView = FloatingToolbar as unknown as ComponentType<Record<string, unknown>>;
  const floatingToolbarExtension = new FloatingToolbarExtension();
  (floatingToolbarExtension as any).config = {
    ...(floatingToolbarExtension as any).config,
    render: (props: unknown) => createElement(FloatingToolbarView, {
      ...(props as Record<string, unknown>),
      commands: floatingToolbarContext.commands,
      activeStates: floatingToolbarContext.activeStates,
      editorTheme: floatingToolbarContext.editorTheme,
    }),
    getCommands: () => floatingToolbarContext.commands,
    getActiveStates: () => floatingToolbarContext.activeStates,
  };
  return floatingToolbarExtension;
}