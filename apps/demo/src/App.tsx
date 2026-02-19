import './App.css'
import {
  ExtensiveEditor,
  extensiveExtensions,
} from "@lyfie/luthor";
import type { ExtensiveEditorRef } from "@lyfie/luthor";
import React from "react";
import "@lyfie/luthor/styles.css";
import { DemoTopBar } from "./components/DemoTopBar";
import { EditorPlayground } from "./components/EditorPlayground";
import { FeatureCoveragePanel } from "./components/FeatureCoveragePanel";
import { PersistencePanel } from "./components/PersistencePanel";
import { ShowcaseHero } from "./components/ShowcaseHero";
import {
  CATEGORY_BY_EXTENSION,
  CATEGORY_ORDER,
  EXTENSIVE_DEMO_MARKDOWN,
  JOURNAL_SCENARIO_JSONB,
} from "./data/demoContent";

type DemoTheme = "light" | "dark";

const THEME_STORAGE_KEY = "luthor-demo-theme";

type PersistedJournalPayload = {
  schemaVersion: 1;
  preset: "extensive";
  theme: DemoTheme;
  savedAt: string;
  extensions: string[];
  content: {
    jsonb: string;
    markdown: string;
  };
};

function getInitialTheme(): DemoTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function titleFromExtensionKey(key: string): string {
  return key
    .replace(/Extension$/i, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function App() {
  const editorRef = React.useRef<ExtensiveEditorRef>(null);

  const [theme, setTheme] = React.useState<DemoTheme>(() => getInitialTheme());
  const [copiedState, setCopiedState] = React.useState<"idle" | "done" | "error">("idle");
  const [payloadEditorValue, setPayloadEditorValue] = React.useState("");
  const [persistenceStatus, setPersistenceStatus] = React.useState(
    "Load the journal scenario, edit it freely, then save to JSONB payload.",
  );

  const extensionNames = React.useMemo(() => {
    const names = extensiveExtensions
      .map((extension) => (extension as { name?: string }).name)
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names));
  }, []);

  const groupedFeatures = React.useMemo(() => {
    const groups = new Map<string, string[]>();

    extensionNames.forEach((name) => {
      const category = CATEGORY_BY_EXTENSION[name] ?? "Other";
      const current = groups.get(category) ?? [];
      current.push(name);
      groups.set(category, current);
    });

    return CATEGORY_ORDER
      .map((title) => ({
        title,
        items: (groups.get(title) ?? []).sort((a, b) => a.localeCompare(b)),
      }))
      .filter((group) => group.items.length > 0);
  }, [extensionNames]);

  const totalFeatureGroups = groupedFeatures.length;
  const densestGroup = groupedFeatures.reduce<{ title: string; count: number }>(
    (largest, group) => (group.items.length > largest.count ? { title: group.title, count: group.items.length } : largest),
    { title: "N/A", count: 0 },
  );

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleEditorReady = React.useCallback((methods: ExtensiveEditorRef) => {
    methods.injectMarkdown(EXTENSIVE_DEMO_MARKDOWN);
  }, []);

  const handleLoadDemoContent = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.injectMarkdown(EXTENSIVE_DEMO_MARKDOWN);
    setPersistenceStatus("Loaded demo markdown content.");
  }, []);

  const handleLoadJournalScenario = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.injectJSONB(JSON.stringify(JOURNAL_SCENARIO_JSONB));
    setPersistenceStatus("Loaded journal scenario from JSONB node data with YouTube and iframe components.");
  }, []);

  const handleSavePayload = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setPersistenceStatus("Editor is not ready yet.");
      return;
    }

    const payload: PersistedJournalPayload = {
      schemaVersion: 1,
      preset: "extensive",
      theme,
      savedAt: new Date().toISOString(),
      extensions: extensionNames,
      content: {
        jsonb: editor.getJSONB(),
        markdown: editor.getMarkdown(),
      },
    };

    setPayloadEditorValue(JSON.stringify(payload, null, 2));
    setPersistenceStatus("Saved editor state as JSONB-ready payload.");
  }, [extensionNames, theme]);

  const handleRestorePayload = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      setPersistenceStatus("Editor is not ready yet.");
      return;
    }

    try {
      const parsed = JSON.parse(payloadEditorValue) as Partial<PersistedJournalPayload>;
      const jsonb = parsed?.content?.jsonb;
      const markdown = parsed?.content?.markdown;

      if (typeof jsonb === "string" && jsonb.trim().length > 0) {
        editor.injectJSONB(jsonb);
        setPersistenceStatus("Restored exact document from payload JSONB node structure.");
        return;
      }

      if (typeof markdown === "string" && markdown.trim().length > 0) {
        editor.injectMarkdown(markdown);
        setPersistenceStatus("Restored from payload markdown fallback.");
        return;
      }

      setPersistenceStatus("Payload is valid JSON but missing content.jsonb/content.markdown.");
    } catch {
      setPersistenceStatus("Payload is not valid JSON.");
    }
  }, [payloadEditorValue]);

  const handleCopyPayload = React.useCallback(async () => {
    if (!payloadEditorValue) {
      setPersistenceStatus("Generate a payload first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(payloadEditorValue);
      setPersistenceStatus("Copied payload to clipboard.");
    } catch {
      setPersistenceStatus("Failed to copy payload.");
    }
  }, [payloadEditorValue]);

  const handleCopyMarkdown = React.useCallback(async () => {
    try {
      const markdown = editorRef.current?.getMarkdown();
      if (!markdown) {
        setCopiedState("error");
        window.setTimeout(() => setCopiedState("idle"), 1600);
        return;
      }
      await navigator.clipboard.writeText(markdown);
      setCopiedState("done");
    } catch {
      setCopiedState("error");
    }

    window.setTimeout(() => setCopiedState("idle"), 1400);
  }, []);

  const handleThemeToggle = React.useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const copyButtonLabel = copiedState === "done" ? "Copied" : copiedState === "error" ? "Copy failed" : "Copy Markdown";

  return (
    <div className="app-shell" data-theme={theme}>
      <main className="demo-page">
        <DemoTopBar
          theme={theme}
          onToggleTheme={handleThemeToggle}
          onLoadDemoContent={handleLoadDemoContent}
        />

        <ShowcaseHero
          extensionCount={extensionNames.length}
          totalFeatureGroups={totalFeatureGroups}
          densestGroupTitle={densestGroup.title}
        />

        <FeatureCoveragePanel
          extensionCount={extensionNames.length}
          totalFeatureGroups={totalFeatureGroups}
          groupedFeatures={groupedFeatures}
          onCopyMarkdown={handleCopyMarkdown}
          copyButtonLabel={copyButtonLabel}
          titleFromExtensionKey={titleFromExtensionKey}
        />

        <PersistencePanel
          payload={payloadEditorValue}
          statusMessage={persistenceStatus}
          onLoadJournalScenario={handleLoadJournalScenario}
          onSavePayload={handleSavePayload}
          onRestorePayload={handleRestorePayload}
          onCopyPayload={handleCopyPayload}
          onPayloadChange={setPayloadEditorValue}
        />

        <EditorPlayground>
          <ExtensiveEditor
            ref={editorRef}
            onReady={handleEditorReady}
            initialTheme={theme}
            showDefaultContent={false}
          />
        </EditorPlayground>
      </main>
    </div>
  );
}

export default App
