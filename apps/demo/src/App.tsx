import {
  ExtensiveEditor,
  extensiveExtensions,
} from "@lyfie/luthor";
import { type ToolbarLayout } from "@lyfie/luthor";
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
  JOURNAL_SCENARIO_JSONB,
} from "./data/demoContent";
import { PACKAGE_DEFINITIONS, REPOSITORY_URL } from "./data/siteContent";
import { useDemoTheme } from "./hooks/useDemoTheme";
import { usePackageStats } from "./hooks/usePackageStats";

type PersistedJournalPayload = {
  schemaVersion: 1;
  preset: "extensive";
  theme: "light" | "dark";
  savedAt: string;
  extensions: string[];
  content: {
    jsonb: string;
  };
};

function titleFromExtensionKey(key: string): string {
  return key
    .replace(/Extension$/i, "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function App() {
  const editorRef = React.useRef<ExtensiveEditorRef>(null);
  const { theme, toggleTheme } = useDemoTheme();
  const { totalWeeklyDownloads } = usePackageStats();

  const myLayout: ToolbarLayout = {
    sections: [
      { items: ["undo", "redo"] },
      { items: ["bold", "italic", "link"] },
    ],
  };

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

  const handleEditorReady = React.useCallback((methods: ExtensiveEditorRef) => {
    methods.injectJSONB(JSON.stringify(JOURNAL_SCENARIO_JSONB));
  }, []);

  const handleLoadDemoContent = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    editor.injectJSONB(JSON.stringify(JOURNAL_SCENARIO_JSONB));
    setPersistenceStatus("Loaded demo JSONB content.");
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

      if (typeof jsonb === "string" && jsonb.trim().length > 0) {
        editor.injectJSONB(jsonb);
        setPersistenceStatus("Restored exact document from payload JSONB node structure.");
        return;
      }

      setPersistenceStatus("Payload is valid JSON but missing content.jsonb.");
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

  const handleCopyJSONB = React.useCallback(async () => {
    try {
      const jsonb = editorRef.current?.getJSONB();
      if (!jsonb) {
        setCopiedState("error");
        window.setTimeout(() => setCopiedState("idle"), 1600);
        return;
      }
      await navigator.clipboard.writeText(jsonb);
      setCopiedState("done");
    } catch {
      setCopiedState("error");
    }

    window.setTimeout(() => setCopiedState("idle"), 1400);
  }, []);

  const copyButtonLabel = copiedState === "done" ? "Copied" : copiedState === "error" ? "Copy failed" : "Copy JSONB";

  return (
    <div className="app-shell" data-theme={theme}>
      <main className="demo-page">
        <DemoTopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          onLoadDemoContent={handleLoadDemoContent}
          repositoryUrl={REPOSITORY_URL}
          luthorNpmUrl={PACKAGE_DEFINITIONS[0].npmUrl}
          headlessNpmUrl={PACKAGE_DEFINITIONS[1].npmUrl}
        />

        <section className="feature-panel editor-spotlight" aria-label="Extensive editor live demo">
          <div className="feature-panel__top">
            <div>
              <p className="demo-kicker">Live Demo</p>
              <h2>Extensive Editor, front and center</h2>
              <p>
                The website opens directly on the flagship Extensive Editor so developers can instantly validate UX quality,
                formatting depth, and real-world content workflows.
              </p>
            </div>
          </div>

          <EditorPlayground>
            <ExtensiveEditor
              ref={editorRef}
              onReady={handleEditorReady}
              initialTheme={theme}
              showDefaultContent={false}
              toolbarLayout={myLayout} 
            />
          </EditorPlayground>
        </section>

        <ShowcaseHero
          extensionCount={extensionNames.length}
          totalFeatureGroups={totalFeatureGroups}
          densestGroupTitle={densestGroup.title}
          totalWeeklyDownloads={totalWeeklyDownloads}
          installUrl={PACKAGE_DEFINITIONS[0].npmUrl}
          repositoryUrl={REPOSITORY_URL}
        />

        <FeatureCoveragePanel
          extensionCount={extensionNames.length}
          totalFeatureGroups={totalFeatureGroups}
          groupedFeatures={groupedFeatures}
          onCopyMarkdown={handleCopyJSONB}
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
      </main>
    </div>
  );
}

export default App;
