import {
  ExtensiveEditor,
  extensiveExtensions,
} from "@lyfie/luthor";
import type { ExtensiveEditorRef } from "@lyfie/luthor";
import React from "react";
import { Link } from "react-router-dom";
import "@lyfie/luthor/styles.css";
import { DemoTopBar } from "../components/DemoTopBar";
import { EditorPlayground } from "../components/EditorPlayground";
import { ShowcaseHero } from "../components/ShowcaseHero";
import {
  CATEGORY_BY_EXTENSION,
  CATEGORY_ORDER,
  JOURNAL_SCENARIO_JSONB,
} from "../data/demoContent";
import { PACKAGE_DEFINITIONS, REPOSITORY_URL } from "../data/siteContent";
import { useDemoTheme } from "../hooks/useDemoTheme";
import { usePackageStats } from "../hooks/usePackageStats";

export function HomePage() {
  const editorRef = React.useRef<ExtensiveEditorRef>(null);
  const { theme, toggleTheme } = useDemoTheme();
  const { totalWeeklyDownloads, packageStats } = usePackageStats();
  const luthorStats = packageStats.find((entry) => entry.packageName === "@lyfie/luthor");
  const headlessStats = packageStats.find((entry) => entry.packageName === "@lyfie/luthor-headless");

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
  }, []);

  return (
    <div className="app-shell" data-theme={theme}>
      <main className="demo-page">
        <DemoTopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          repositoryUrl={REPOSITORY_URL}
          luthorNpmUrl={PACKAGE_DEFINITIONS[0].npmUrl}
          headlessNpmUrl={PACKAGE_DEFINITIONS[1].npmUrl}
        />

        <ShowcaseHero
          extensionCount={extensionNames.length}
          totalFeatureGroups={totalFeatureGroups}
          densestGroupTitle={densestGroup.title}
          totalWeeklyDownloads={totalWeeklyDownloads}
          installUrl={PACKAGE_DEFINITIONS[0].npmUrl}
          repositoryUrl={REPOSITORY_URL}
        />

        <section className="feature-panel editor-spotlight editor-spotlight--compact" aria-label="Extensive editor live demo">
          <div className="feature-panel__top">
            <div>
              <p className="demo-kicker">Live Demo</p>
              <h2>Extensive Editor, instantly testable</h2>
              <p>Compact, fully visible preview with no wrapper scrollbars.</p>
            </div>
            <div className="feature-panel__actions">
              <button type="button" className="demo-button" onClick={handleLoadDemoContent}>
                Load Demo Content
              </button>
            </div>
          </div>

          <div className="proof-inline" role="list" aria-label="Above the fold social proof">
            <span className="feature-chip" role="listitem">
              {totalWeeklyDownloads > 0
                ? `${new Intl.NumberFormat("en", { notation: "compact" }).format(totalWeeklyDownloads)} weekly installs`
                : "Live npm metrics loading"}
            </span>
            <span className="feature-chip" role="listitem">MIT • Free Forever</span>
            <span className="feature-chip" role="listitem">React 18/19 + Lexical</span>
            <span className="feature-chip" role="listitem">Type-Safe Extension Model</span>
          </div>

          <EditorPlayground>
            <ExtensiveEditor
              ref={editorRef}
              onReady={handleEditorReady}
              initialTheme={theme}
              showDefaultContent={false}
            />
          </EditorPlayground>
        </section>

        <section className="feature-panel pricing-panel" aria-label="Package comparison">
          <div className="feature-panel__top">
            <div>
              <h2>Pick your build path</h2>
              <p>Both are free. Choose speed or control.</p>
            </div>
          </div>

          <div className="pricing-grid" role="list" aria-label="Pricing-style package comparison">
            <article className="feature-group pricing-card" role="listitem">
              <div className="feature-group__header">
                <h3>@lyfie/luthor</h3>
                <span>Most popular</span>
              </div>
              <p className="pricing-price">$0</p>
              <p className="docs-card__summary">Preset editor. Fastest route to production.</p>
              <ul className="wiki-list pricing-list">
                <li>✔ Extensive Editor included</li>
                <li>✔ Prebuilt toolbar + command UX</li>
                <li>✔ Visual and JSONB reversible modes</li>
                <li>{luthorStats?.version ? `Latest version ${luthorStats.version}` : "Version tracked from npm"}</li>
              </ul>
              <div className="feature-panel__actions">
                <a className="demo-button" href={PACKAGE_DEFINITIONS[0].npmUrl} target="_blank" rel="noreferrer">
                  Install Luthor
                </a>
              </div>
            </article>

            <article className="feature-group pricing-card" role="listitem">
              <div className="feature-group__header">
                <h3>@lyfie/luthor-headless</h3>
                <span>Builder mode</span>
              </div>
              <p className="pricing-price">$0</p>
              <p className="docs-card__summary">Headless runtime for custom editor products.</p>
              <ul className="wiki-list pricing-list">
                <li>✔ Typed extension architecture</li>
                <li>✔ Custom toolbar + command surfaces</li>
                <li>✔ Fidelity-first import/export strategy</li>
                <li>{headlessStats?.version ? `Latest version ${headlessStats.version}` : "Version tracked from npm"}</li>
              </ul>
              <div className="feature-panel__actions">
                <a className="demo-button demo-button--ghost" href={PACKAGE_DEFINITIONS[1].npmUrl} target="_blank" rel="noreferrer">
                  Install Headless
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="feature-panel" aria-label="Primary call to action">
          <div className="feature-panel__top">
            <div>
              <h2>Ship now</h2>
              <p>
                Start with presets. Scale with headless.
              </p>
            </div>
            <div className="feature-panel__actions">
              <Link className="demo-button" to="/demo">
                Open Full Demo
              </Link>
              <Link className="demo-button demo-button--ghost" to="/docs">
                Read Documentation
              </Link>
              <Link className="demo-button demo-button--ghost" to="/ecosystem">
                View Ecosystem
              </Link>
            </div>
          </div>

          <div className="sell-strip" role="list" aria-label="Conversion metrics and install commands">
            <article className="feature-group" role="listitem">
              <div className="feature-group__header">
                <h3>Weekly downloads</h3>
                <span>Live</span>
              </div>
              <p className="docs-card__summary">
                {totalWeeklyDownloads > 0
                  ? `${new Intl.NumberFormat("en", { notation: "compact" }).format(totalWeeklyDownloads)} installs/week`
                  : "Fetching live npm activity"}
              </p>
            </article>

            <article className="feature-group sell-code-card" role="listitem">
              <div className="feature-group__header">
                <h3>Install preset</h3>
                <span>Fastest path</span>
              </div>
              <pre>
                <code>pnpm add @lyfie/luthor react react-dom</code>
              </pre>
            </article>

            <article className="feature-group sell-code-card" role="listitem">
              <div className="feature-group__header">
                <h3>Install headless</h3>
                <span>Full control</span>
              </div>
              <pre>
                <code>pnpm add @lyfie/luthor-headless lexical @lexical/react react react-dom</code>
              </pre>
            </article>

            <article className="feature-group" role="listitem">
              <div className="feature-group__header">
                <h3>Latest versions</h3>
                <span>npm</span>
              </div>
              <p className="docs-card__summary">
                {packageStats
                  .map((item) => `${item.packageName} ${item.version ?? "N/A"}`)
                  .join(" • ")}
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
