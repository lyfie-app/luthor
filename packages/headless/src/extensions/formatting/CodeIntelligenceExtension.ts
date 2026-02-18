import {
  $isCodeNode,
  CODE_LANGUAGE_MAP,
  CodeNode,
  normalizeCodeLang,
} from "@lexical/code";
import { registerMarkdownShortcuts, TRANSFORMERS } from "@lexical/markdown";
import type { LexicalEditor, LexicalNode } from "lexical";
import { $getSelection, $isRangeSelection, $nodesOfType } from "lexical";
import { BaseExtension } from "../base/BaseExtension";

type LowlightLike = {
  highlightAuto: (
    value: string,
    options?: { subset?: string[] },
  ) => { data?: { language?: string } } | { language?: string };
};

export type CodeIntelligenceCommands = {
  setCodeLanguage: (language: string) => void;
  autoDetectCodeLanguage: () => Promise<string | null>;
  getCurrentCodeLanguage: () => Promise<string | null>;
  getCodeLanguageOptions: () => string[];
};

const DEFAULT_LANGUAGE_OPTIONS = [
  "plaintext",
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "json",
  "html",
  "css",
  "bash",
  "python",
  "java",
  "c",
  "cpp",
  "go",
  "rust",
  "sql",
  "yaml",
  "markdown",
] as const;

export class CodeIntelligenceExtension extends BaseExtension<
  "codeIntelligence",
  {},
  CodeIntelligenceCommands,
  {}
> {
  private lowlightPromise: Promise<LowlightLike | null> | null = null;
  private attemptedNodeKeys = new Set<string>();
  private autoDetectScheduled = false;
  private controlsCleanup = new Map<string, () => void>();

  constructor() {
    super("codeIntelligence");
  }

  register(editor: LexicalEditor): () => void {
    const languageOptions = this.getLanguageOptions();

    const unregisterMarkdownShortcuts = registerMarkdownShortcuts(
      editor,
      TRANSFORMERS,
    );

    const unregisterCodeMutation = editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        mutations.forEach((mutation, nodeKey) => {
          if (mutation === "destroyed") {
            this.controlsCleanup.get(nodeKey)?.();
            this.controlsCleanup.delete(nodeKey);
            return;
          }

          queueMicrotask(() => {
            this.mountCodeBlockControls(editor, nodeKey, languageOptions);
          });
        });
      },
      { skipInitialization: false },
    );

    const unregisterUpdate = editor.registerUpdateListener(() => {
      if (this.autoDetectScheduled) return;

      this.autoDetectScheduled = true;
      queueMicrotask(() => {
        this.autoDetectScheduled = false;
        void this.autoDetectLanguageForUnlabeledBlocks(editor);
      });

      this.syncCodeBlockControls(editor);
    });

    return () => {
      unregisterMarkdownShortcuts();
      unregisterCodeMutation();
      unregisterUpdate();
      this.controlsCleanup.forEach((cleanup) => cleanup());
      this.controlsCleanup.clear();
    };
  }

  getCommands(editor: LexicalEditor): CodeIntelligenceCommands {
    return {
      setCodeLanguage: (language: string) => {
        const normalized = normalizeLanguage(language);
        const theme = this.getThemeForLanguage(normalized);
        editor.update(() => {
          this.getSelectionCodeNodes().forEach((node) => {
            node.setLanguage(normalized ?? null);
            node.setTheme(theme);
          });
        });
      },
      autoDetectCodeLanguage: async () => {
        const target = await this.getPrimaryCodeBlockText(editor);
        if (!target) {
          return null;
        }

        const detected = await this.detectLanguage(target.text);
        if (!detected) {
          return null;
        }

        editor.update(() => {
          const node = target.key
            ? ($nodesOfType(CodeNode).find((item) => item.getKey() === target.key) ??
              null)
            : null;

          if (node) {
            node.setLanguage(detected);
            node.setTheme(this.getThemeForLanguage(detected));
            this.attemptedNodeKeys.delete(node.getKey());
            return;
          }

          this.getSelectionCodeNodes().forEach((codeNode) => {
            codeNode.setLanguage(detected);
            codeNode.setTheme(this.getThemeForLanguage(detected));
            this.attemptedNodeKeys.delete(codeNode.getKey());
          });
        });

        return detected;
      },
      getCurrentCodeLanguage: () =>
        new Promise((resolve) => {
          editor.getEditorState().read(() => {
            const nodes = this.getSelectionCodeNodes();
            resolve(nodes[0]?.getLanguage() ?? null);
          });
        }),
      getCodeLanguageOptions: () => this.getLanguageOptions(),
    };
  }

  private async autoDetectLanguageForUnlabeledBlocks(
    editor: LexicalEditor,
  ): Promise<void> {
    const pending = editor
      .getEditorState()
      .read(() =>
        $nodesOfType(CodeNode)
          .filter((node) => {
            if (node.getLanguage()) return false;
            if (this.attemptedNodeKeys.has(node.getKey())) return false;
            return node.getTextContent().trim().length > 0;
          })
          .map((node) => ({
            key: node.getKey(),
            text: node.getTextContent(),
          })),
      );

    if (!pending.length) {
      return;
    }

    for (const block of pending) {
      const detected = await this.detectLanguage(block.text);

      if (!detected) {
        this.attemptedNodeKeys.add(block.key);
        continue;
      }

      editor.update(() => {
        const node = $nodesOfType(CodeNode).find(
          (item) => item.getKey() === block.key,
        );
        if (!node || node.getLanguage()) {
          return;
        }
        node.setLanguage(detected);
        node.setTheme(this.getThemeForLanguage(detected));
      });
    }
  }

  private getThemeForLanguage(language: string | null | undefined): string | null {
    if (!language) {
      return "lang-default";
    }

    const normalized = normalizeLanguage(language) ?? "plain";
    const family = resolveLanguageFamily(normalized);
    return `lang-${family}`;
  }

  private mountCodeBlockControls(
    editor: LexicalEditor,
    nodeKey: string,
    languageOptions: string[],
  ): void {
    if (this.controlsCleanup.has(nodeKey)) {
      return;
    }

    const codeElement = editor.getElementByKey(nodeKey) as HTMLElement | null;
    if (!codeElement) {
      return;
    }

    codeElement.classList.add("luthor-code-block--interactive");

    const controls = document.createElement("div");
    controls.className = "luthor-codeblock-controls";
    controls.contentEditable = "false";

    const select = document.createElement("select");
    select.className = "luthor-codeblock-language";
    select.setAttribute("aria-label", "Code language");

    const autoOption = document.createElement("option");
    autoOption.value = "auto";
    autoOption.textContent = "Auto";
    select.appendChild(autoOption);

    languageOptions.forEach((language) => {
      const option = document.createElement("option");
      option.value = language;
      option.textContent = language;
      select.appendChild(option);
    });

    const copyButton = document.createElement("button");
    copyButton.className = "luthor-codeblock-copy";
    copyButton.type = "button";
    copyButton.textContent = "Copy";

    const onSelectChange = () => {
      const selectedLanguage = select.value;
      editor.update(() => {
        const node = $nodesOfType(CodeNode).find((item) => item.getKey() === nodeKey);
        if (!node) return;

        const normalized = normalizeLanguage(selectedLanguage);
        node.setLanguage(normalized ?? null);
        node.setTheme(this.getThemeForLanguage(normalized));
      });
    };

    const onCopyClick = async () => {
      const text = editor.getEditorState().read(() => {
        const node = $nodesOfType(CodeNode).find((item) => item.getKey() === nodeKey);
        return node?.getTextContent() ?? "";
      });

      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = "Copied";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 1200);
      } catch {
        copyButton.textContent = "Failed";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 1200);
      }
    };

    select.addEventListener("change", onSelectChange);
    copyButton.addEventListener("click", onCopyClick);

    controls.appendChild(select);
    controls.appendChild(copyButton);
    codeElement.prepend(controls);

    this.controlsCleanup.set(nodeKey, () => {
      select.removeEventListener("change", onSelectChange);
      copyButton.removeEventListener("click", onCopyClick);
      controls.remove();
      codeElement.classList.remove("luthor-code-block--interactive");
    });

    this.syncCodeBlockControls(editor);
  }

  private syncCodeBlockControls(editor: LexicalEditor): void {
    this.controlsCleanup.forEach((_cleanup, nodeKey) => {
      const codeElement = editor.getElementByKey(nodeKey) as HTMLElement | null;
      if (!codeElement) return;

      const select = codeElement.querySelector(".luthor-codeblock-language") as
        | HTMLSelectElement
        | null;
      if (!select) return;

      const language = editor.getEditorState().read(() => {
        const node = $nodesOfType(CodeNode).find((item) => item.getKey() === nodeKey);
        return normalizeLanguage(node?.getLanguage() ?? null) ?? "auto";
      });

      if (select.value !== language) {
        select.value = language;
      }
    });
  }

  private async getPrimaryCodeBlockText(
    editor: LexicalEditor,
  ): Promise<{ key: string; text: string } | null> {
    return new Promise((resolve) => {
      editor.getEditorState().read(() => {
        const nodes = this.getSelectionCodeNodes();
        const node = nodes[0];
        if (!node) {
          resolve(null);
          return;
        }
        const text = node.getTextContent().trim();
        if (!text) {
          resolve(null);
          return;
        }
        resolve({ key: node.getKey(), text });
      });
    });
  }

  private getSelectionCodeNodes(): CodeNode[] {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return [];

    const allNodes = selection.getNodes();
    const codeNodes = new Map<string, CodeNode>();

    allNodes.forEach((node) => {
      const codeNode = this.getNearestCodeNode(node);
      if (!codeNode) return;
      codeNodes.set(codeNode.getKey(), codeNode);
    });

    return Array.from(codeNodes.values());
  }

  private getNearestCodeNode(node: LexicalNode): CodeNode | null {
    let current: LexicalNode | null = node;

    while (current) {
      if ($isCodeNode(current)) {
        return current;
      }
      current = current.getParent();
    }

    return null;
  }

  private async detectLanguage(source: string): Promise<string | null> {
    if (!source.trim()) {
      return null;
    }

    const lowlight = await this.loadLowlight();
    if (!lowlight) {
      return null;
    }

    try {
      const result = lowlight.highlightAuto(source, {
        subset: this.getLanguageOptions(),
      }) as { data?: { language?: string }; language?: string };
      const rawLanguage = result?.data?.language ?? result?.language;

      if (!rawLanguage || typeof rawLanguage !== "string") {
        return null;
      }

      return normalizeLanguage(rawLanguage);
    } catch {
      return null;
    }
  }

  private getLanguageOptions(): string[] {
    const lexicalLanguages = Object.keys(CODE_LANGUAGE_MAP || {});
    const merged = new Set<string>([
      ...DEFAULT_LANGUAGE_OPTIONS,
      ...lexicalLanguages,
    ]);

    const normalizedUnique = new Set<string>();

    Array.from(merged)
      .map((lang) => normalizeLanguage(lang))
      .filter((lang): lang is string => !!lang)
      .forEach((lang) => normalizedUnique.add(lang));

    return Array.from(normalizedUnique).sort((a, b) => a.localeCompare(b));
  }

  private async loadLowlight(): Promise<LowlightLike | null> {
    if (this.lowlightPromise) {
      return this.lowlightPromise;
    }

    this.lowlightPromise = (async () => {
      try {
        const dynamicImport = new Function(
          "moduleName",
          "return import(moduleName)",
        ) as (moduleName: string) => Promise<Record<string, unknown>>;

        const module = await dynamicImport("lowlight");

        const instance =
          (module.lowlight as LowlightLike | undefined) ??
          (typeof module.createLowlight === "function"
            ? (module.createLowlight as (common?: unknown) => LowlightLike)(
                module.common,
              )
            : null);

        if (!instance || typeof instance.highlightAuto !== "function") {
          return null;
        }

        return instance;
      } catch {
        return null;
      }
    })();

    return this.lowlightPromise;
  }
}

function resolveLanguageFamily(language: string): string {
  const lang = language.toLowerCase();

  if (["javascript", "typescript", "jsx", "tsx", "json"].includes(lang)) {
    return "javascript";
  }

  if (["html", "xml", "svg", "markdown", "md"].includes(lang)) {
    return "markup";
  }

  if (["css", "scss", "sass", "less"].includes(lang)) {
    return "styles";
  }

  if (["python", "py"].includes(lang)) {
    return "python";
  }

  if (["bash", "shell", "sh", "zsh", "powershell"].includes(lang)) {
    return "shell";
  }

  if (["sql", "postgres", "mysql"].includes(lang)) {
    return "sql";
  }

  if (["rust", "go", "java", "c", "cpp", "csharp", "kotlin", "swift"].includes(lang)) {
    return "systems";
  }

  return "default";
}

function normalizeLanguage(language: string | null | undefined): string | null {
  if (!language) return null;

  const trimmed = language.trim().toLowerCase();
  if (!trimmed || trimmed === "auto") return null;

  const normalized = normalizeCodeLang(trimmed);
  if (!normalized || normalized === "auto") return null;

  return normalized;
}

export const codeIntelligenceExtension = new CodeIntelligenceExtension();