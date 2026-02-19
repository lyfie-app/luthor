import { LexicalEditor, $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import React from "react";
import { BaseExtension } from "@lyfie/luthor-headless/extensions/base";
import { BaseExtensionConfig, ExtensionCategory } from "@lyfie/luthor-headless/extensions/types";

export type SlashCommandItem = {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  keywords?: string[];
  category?: string;
  icon?: React.ReactNode;
  shortcut?: string;
};

export type SlashCommandMenuState = {
  isOpen: boolean;
  query: string;
  position: { x: number; y: number } | null;
  commands: SlashCommandItem[];
};

export interface SlashCommandConfig extends BaseExtensionConfig {
  trigger?: string;
  offset?: { x: number; y: number };
}

export type SlashCommandCommands = {
  registerSlashCommand: (item: SlashCommandItem) => void;
  unregisterSlashCommand: (id: string) => void;
  closeSlashMenu: () => void;
  executeSlashCommand: (id: string) => boolean;
};

export type SlashCommandStateQueries = {
  isSlashMenuOpen: () => Promise<boolean>;
};

type SlashMatch = {
  nodeKey: string;
  startOffset: number;
  endOffset: number;
  query: string;
};

export class SlashCommandExtension extends BaseExtension<
  "slashCommand",
  SlashCommandConfig,
  SlashCommandCommands,
  SlashCommandStateQueries,
  React.ReactElement[]
> {
  private commands: Map<string, SlashCommandItem> = new Map();
  private listeners: ((state: SlashCommandMenuState) => void)[] = [];
  private isOpen = false;
  private query = "";
  private position: { x: number; y: number } | null = null;
  private activeMatch: SlashMatch | null = null;

  constructor(config: SlashCommandConfig = {}) {
    super("slashCommand", [ExtensionCategory.Toolbar]);
    this.config = {
      trigger: "/",
      offset: { x: 0, y: 8 },
      ...config,
    };
  }

  register(editor: LexicalEditor): () => void {
    const unregisterUpdate = editor.registerUpdateListener(() => {
      this.updateMatchFromSelection(editor);
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (!this.isOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        this.closeSlashMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const handlePointerDown = () => {
      if (this.isOpen) {
        this.closeSlashMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      unregisterUpdate();
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handlePointerDown);
      this.activeMatch = null;
      this.isOpen = false;
      this.query = "";
      this.position = null;
      this.notifyListeners();
    };
  }

  getCommands(editor: LexicalEditor): SlashCommandCommands {
    return {
      registerSlashCommand: (item: SlashCommandItem) => this.registerSlashCommand(item),
      unregisterSlashCommand: (id: string) => this.unregisterSlashCommand(id),
      closeSlashMenu: () => this.closeSlashMenu(),
      executeSlashCommand: (id: string) => this.executeSlashCommand(editor, id),
    };
  }

  getStateQueries(_editor: LexicalEditor): SlashCommandStateQueries {
    void _editor;
    return {
      isSlashMenuOpen: () => Promise.resolve(this.isOpen),
    };
  }

  subscribe(listener: (state: SlashCommandMenuState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    };
  }

  getAllCommands(): SlashCommandItem[] {
    return Array.from(this.commands.values());
  }

  private registerSlashCommand(item: SlashCommandItem) {
    this.commands.set(item.id, item);
    this.notifyListeners();
  }

  private unregisterSlashCommand(id: string) {
    this.commands.delete(id);
    this.notifyListeners();
  }

  private closeSlashMenu() {
    this.isOpen = false;
    this.query = "";
    this.position = null;
    this.activeMatch = null;
    this.notifyListeners();
  }

  private executeSlashCommand(editor: LexicalEditor, id: string): boolean {
    const command = this.commands.get(id);
    if (!command) {
      return false;
    }

    if (this.activeMatch) {
      const match = this.activeMatch;
      editor.update(() => {
        const targetNode = $getNodeByKey(match.nodeKey);
        if (!$isTextNode(targetNode)) {
          return;
        }

        const safeOffset = Math.max(0, Math.min(match.endOffset, targetNode.getTextContentSize()));
        targetNode.select(safeOffset, safeOffset);

        const deleteLength = Math.max(0, match.endOffset - match.startOffset);
        if (deleteLength > 0) {
          targetNode.spliceText(match.startOffset, deleteLength, "", true);
        }
      });
    }

    this.closeSlashMenu();
    command.action();
    return true;
  }

  private updateMatchFromSelection(editor: LexicalEditor) {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        this.closeIfNeeded();
        return;
      }

      const anchorNode = selection.anchor.getNode();
      if (!$isTextNode(anchorNode)) {
        this.closeIfNeeded();
        return;
      }

      const offset = selection.anchor.offset;
      const textContent = anchorNode.getTextContent();
      const textBeforeCursor = textContent.slice(0, offset);
      const trigger = this.config.trigger || "/";
      const triggerIndex = textBeforeCursor.lastIndexOf(trigger);

      if (triggerIndex < 0) {
        this.closeIfNeeded();
        return;
      }

      const prefix = textBeforeCursor.slice(0, triggerIndex);
      const isAtWordBoundary = prefix.length === 0 || /\s/.test(prefix[prefix.length - 1] || "");
      if (!isAtWordBoundary) {
        this.closeIfNeeded();
        return;
      }

      const query = textBeforeCursor.slice(triggerIndex + trigger.length);
      if (/\s/.test(query)) {
        this.closeIfNeeded();
        return;
      }

      const position = this.getCaretPosition();
      this.isOpen = true;
      this.query = query;
      this.position = position;
      this.activeMatch = {
        nodeKey: anchorNode.getKey(),
        startOffset: triggerIndex,
        endOffset: offset,
        query,
      };
      this.notifyListeners();
    });
  }

  private closeIfNeeded() {
    if (!this.isOpen && !this.activeMatch) {
      return;
    }
    this.closeSlashMenu();
  }

  private getCaretPosition(): { x: number; y: number } | null {
    if (typeof window === "undefined") {
      return null;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      return null;
    }

    const range = domSelection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    const firstClientRect = range.getClientRects()[0];
    const safeRect = firstClientRect || rect;

    const xOffset = this.config.offset?.x ?? 0;
    const yOffset = this.config.offset?.y ?? 8;

    return {
      x: safeRect.left + xOffset,
      y: safeRect.bottom + yOffset,
    };
  }

  private getState(): SlashCommandMenuState {
    return {
      isOpen: this.isOpen,
      query: this.query,
      position: this.position,
      commands: this.getAllCommands(),
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export const slashCommandExtension = new SlashCommandExtension();
export default slashCommandExtension;
