import { PrismTokenizer } from "@lexical/code";

export type CodeTokenizer = {
  defaultLanguage: string;
  tokenize: (code: string, language?: string) => unknown[];
};

export type CodeHighlightResult = {
  language?: string | null;
};

export type CodeHighlightProvider = {
  highlightAuto?: (
    code: string,
    languageSubset?: string[],
  ) => CodeHighlightResult | Promise<CodeHighlightResult>;
  tokenizer?: CodeTokenizer | null;
  getTokenizer?: () => CodeTokenizer | null | Promise<CodeTokenizer | null>;
};

export type CodeHighlightProviderConfig = {
  provider?: CodeHighlightProvider | null;
  loadProvider?: () => Promise<CodeHighlightProvider | null>;
};

const HIGHLIGHT_JS_MODULE = "highlight.js/lib/core";
const FALLBACK_HIGHLIGHT_THEME = "lang-default";

let cachedAutoProviderPromise: Promise<CodeHighlightProvider | null> | null = null;

export function getFallbackCodeTheme(): string {
  return FALLBACK_HIGHLIGHT_THEME;
}

export function getDefaultCodeTokenizer(): CodeTokenizer {
  return PrismTokenizer as unknown as CodeTokenizer;
}

export function getGlobalCodeHighlightProvider(): CodeHighlightProvider | null {
  const globalObject = globalThis as Record<string, unknown>;
  const candidate = globalObject.hljs as { highlightAuto?: unknown } | undefined;

  if (
    candidate &&
    typeof candidate === "object" &&
    typeof candidate.highlightAuto === "function"
  ) {
    return {
      highlightAuto: candidate.highlightAuto as (
        code: string,
        languageSubset?: string[],
      ) => CodeHighlightResult,
    };
  }

  return null;
}

export async function loadDynamicHighlightJsProvider(): Promise<CodeHighlightProvider | null> {
  try {
    const dynamicImport = new Function(
      "moduleName",
      "return import(moduleName)",
    ) as (moduleName: string) => Promise<Record<string, unknown>>;

    const module = await dynamicImport(HIGHLIGHT_JS_MODULE);
    const candidate = (module.default ?? module) as { highlightAuto?: unknown };

    if (
      candidate &&
      typeof candidate === "object" &&
      typeof candidate.highlightAuto === "function"
    ) {
      return {
        highlightAuto: candidate.highlightAuto as (
          code: string,
          languageSubset?: string[],
        ) => CodeHighlightResult,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function resolveCodeHighlightProvider(
  config?: CodeHighlightProviderConfig,
): Promise<CodeHighlightProvider | null> {
  if (config?.provider) {
    return config.provider;
  }

  if (config?.loadProvider) {
    return config.loadProvider();
  }

  if (cachedAutoProviderPromise) {
    return cachedAutoProviderPromise;
  }

  cachedAutoProviderPromise = (async () => {
    const globalProvider = getGlobalCodeHighlightProvider();
    if (globalProvider) {
      return globalProvider;
    }

    return loadDynamicHighlightJsProvider();
  })();

  return cachedAutoProviderPromise;
}

export async function resolveCodeTokenizer(
  provider: CodeHighlightProvider | null,
): Promise<CodeTokenizer | null> {
  if (!provider) {
    return null;
  }

  if (provider.tokenizer) {
    return provider.tokenizer;
  }

  if (!provider.getTokenizer) {
    return null;
  }

  return provider.getTokenizer();
}

export function resetCodeHighlightProviderCacheForTests(): void {
  cachedAutoProviderPromise = null;
}
