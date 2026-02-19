import { DemoTopBar } from "../components/DemoTopBar";
import { DOCS_WIKI_SECTIONS } from "../data/docsWikiContent";
import { PACKAGE_DEFINITIONS, REPOSITORY_URL } from "../data/siteContent";
import { useDemoTheme } from "../hooks/useDemoTheme";

export function DocsPage() {
  const { theme, toggleTheme } = useDemoTheme();

  return (
    <div className="app-shell" data-theme={theme}>
      <main className="demo-page wiki-page">
        <DemoTopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          repositoryUrl={REPOSITORY_URL}
          luthorNpmUrl={PACKAGE_DEFINITIONS[0].npmUrl}
          headlessNpmUrl={PACKAGE_DEFINITIONS[1].npmUrl}
        />

        <section className="hero-panel wiki-hero" aria-label="Documentation wiki intro">
          <p className="demo-kicker">Wiki Documentation</p>
          <h1>
            Luthor docs, in one page.
            <span> No redirects, no noise.</span>
          </h1>
          <p>
            This wiki is derived from the repository documentation and condensed for quick implementation decisions.
          </p>
        </section>

        <section className="wiki-layout" aria-label="Wiki sections">
          <aside className="feature-panel wiki-sidebar" aria-label="Wiki navigation">
            <h2>Sections</h2>
            <nav>
              {DOCS_WIKI_SECTIONS.map((section, index) => (
                <a key={section.id} href={`#${section.id}`}>
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="wiki-content" role="list" aria-label="Wiki content blocks">
            {DOCS_WIKI_SECTIONS.map((section) => (
              <article key={section.id} id={section.id} className="feature-panel wiki-section" role="listitem">
                <div className="wiki-section__head">
                  <h2>{section.title}</h2>
                  <p>{section.summary}</p>
                </div>

                {section.bullets?.length ? (
                  <ul className="wiki-list">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {section.snippet ? (
                  <div className="wiki-snippet">
                    <div className="wiki-snippet__label">{section.snippet.language}</div>
                    <pre>
                      <code>{section.snippet.code}</code>
                    </pre>
                  </div>
                ) : null}

                <div className="wiki-sources">
                  <p>Derived from</p>
                  <div>
                    {section.sourceRefs.map((source) => (
                      <span key={source} className="feature-chip">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
