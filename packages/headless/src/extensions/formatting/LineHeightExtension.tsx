import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { BaseExtension } from "../base/BaseExtension";
import { ExtensionCategory, type BaseExtensionConfig } from "../types";

export type LineHeightOption = {
  value: string;
  label: string;
  lineHeight: string;
};

export interface LineHeightConfig extends BaseExtensionConfig {
  options: readonly LineHeightOption[];
}

export type LineHeightCommands = {
  setLineHeight: (lineHeightValue: string) => void;
  clearLineHeight: () => void;
  getCurrentLineHeight: () => Promise<string | null>;
  getLineHeightOptions: () => readonly LineHeightOption[];
};

export type LineHeightStateQueries = {
  hasCustomLineHeight: () => Promise<boolean>;
};

const DEFAULT_LINE_HEIGHT_OPTIONS: readonly LineHeightOption[] = [
  { value: "default", label: "Default", lineHeight: "normal" },
  { value: "1", label: "1.0", lineHeight: "1" },
  { value: "1.15", label: "1.15", lineHeight: "1.15" },
  { value: "1.5", label: "1.5", lineHeight: "1.5" },
  { value: "1.75", label: "1.75", lineHeight: "1.75" },
  { value: "2", label: "2.0", lineHeight: "2" },
];

export class LineHeightExtension extends BaseExtension<
  "lineHeight",
  LineHeightConfig,
  LineHeightCommands,
  LineHeightStateQueries
> {
  constructor() {
    super("lineHeight", [ExtensionCategory.Toolbar]);
    this.config = {
      options: DEFAULT_LINE_HEIGHT_OPTIONS,
      showInToolbar: true,
      category: [ExtensionCategory.Toolbar],
    };
  }

  register(): () => void {
    return () => {};
  }

  getCommands(editor: LexicalEditor): LineHeightCommands {
    return {
      setLineHeight: (lineHeightValue: string) => {
        const option = this.findOption(lineHeightValue);
        if (!option) return;
        this.applyLineHeight(editor, option.lineHeight);
      },
      clearLineHeight: () => {
        this.applyLineHeight(editor, "");
      },
      getCurrentLineHeight: () => Promise.resolve(this.getCurrentLineHeightValue(editor)),
      getLineHeightOptions: () => this.config.options,
    };
  }

  getStateQueries(editor: LexicalEditor): LineHeightStateQueries {
    return {
      hasCustomLineHeight: () => Promise.resolve(this.hasCustomLineHeight(editor)),
    };
  }

  private applyLineHeight(editor: LexicalEditor, lineHeight: string) {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      $patchStyleText(selection, {
        "line-height": lineHeight,
      });
    });
  }

  private hasCustomLineHeight(editor: LexicalEditor): boolean {
    let hasCustomLineHeight = false;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const current = $getSelectionStyleValueForProperty(selection, "line-height", "");
      const normalized = this.normalizeValue(current);
      hasCustomLineHeight = normalized.length > 0 && normalized !== "normal";
    });

    return hasCustomLineHeight;
  }

  private getCurrentLineHeightValue(editor: LexicalEditor): string | null {
    let currentValue: string | null = null;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const current = $getSelectionStyleValueForProperty(selection, "line-height", "");
      const normalizedCurrent = this.normalizeValue(current);

      if (!normalizedCurrent || normalizedCurrent === "normal") {
        currentValue = "default";
        return;
      }

      const matched = this.config.options.find((option) => {
        if (this.normalizeValue(option.value) === normalizedCurrent) {
          return true;
        }
        return this.normalizeValue(option.lineHeight) === normalizedCurrent;
      });

      currentValue = matched?.value ?? null;
    });

    return currentValue;
  }

  private findOption(value: string): LineHeightOption | undefined {
    const normalizedValue = this.normalizeValue(value);
    return this.config.options.find((option) => {
      return this.normalizeValue(option.value) === normalizedValue;
    });
  }

  private normalizeValue(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, "");
  }
}

export const lineHeightExtension = new LineHeightExtension();
