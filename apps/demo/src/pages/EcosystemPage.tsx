import { DemoTopBar } from "../components/DemoTopBar";
import { ISSUES_URL, PACKAGE_DEFINITIONS, REPOSITORY_URL, SPONSOR_URL, TRUST_PROOF_ITEMS } from "../data/siteContent";
import { useDemoTheme } from "../hooks/useDemoTheme";
import { formatCompactNumber, formatUnpackedSize, usePackageStats } from "../hooks/usePackageStats";

export function EcosystemPage() {
  const { theme, toggleTheme } = useDemoTheme();
  const { packageStats, packageStatsStatus } = usePackageStats();

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

        <section className="hero-panel" aria-label="Ecosystem overview">
          <p className="demo-kicker">Ecosystem</p>
          <h1>
            Choose the editor stack teams can trust.
            <span> Open, stable, and built to ship.</span>
          </h1>
          <p>
            Evaluate momentum, package quality, and evidence-backed engineering claims in one place.
          </p>
        </section>

        <section id="ecosystem" className="feature-panel" aria-label="Package ecosystem and npm metrics">
          <div className="feature-panel__top">
            <div>
              <h2>Package ecosystem</h2>
              <p>
                MIT license, free forever usage, React compatibility, and Lexical foundation.
              </p>
            </div>
            <div className="feature-panel__actions">
              <a className="demo-button demo-button--ghost" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
                GitHub Repo
              </a>
              <a className="demo-button demo-button--ghost" href={ISSUES_URL} target="_blank" rel="noreferrer">
                Report Issue
              </a>
              <a className="demo-button" href={SPONSOR_URL} target="_blank" rel="noreferrer">
                Donate / Sponsor
              </a>
            </div>
          </div>

          <div className="package-metrics-grid" role="list" aria-label="npm package metrics">
            {packageStats.map((entry) => (
              <article key={entry.packageName} className="feature-group package-card" role="listitem">
                <div className="feature-group__header package-card__header">
                  <h3>{entry.packageName}</h3>
                  <a href={entry.npmUrl} target="_blank" rel="noreferrer">
                    npm
                  </a>
                </div>
                <p className="package-card__summary">{entry.description}</p>
                <div className="package-card__stats">
                  <div>
                    <span>Weekly downloads</span>
                    <strong>{entry.weeklyDownloads ? formatCompactNumber(entry.weeklyDownloads) : "N/A"}</strong>
                  </div>
                  <div>
                    <span>Latest version</span>
                    <strong>{entry.version ?? "N/A"}</strong>
                  </div>
                  <div>
                    <span>Unpacked size</span>
                    <strong>{formatUnpackedSize(entry.unpackedSize)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="panel-footnote" role="status">
            {packageStatsStatus === "loading" && "Fetching live npm metrics..."}
            {packageStatsStatus === "error" && "Unable to fetch live metrics right now. External links remain available."}
            {packageStatsStatus === "ready" && "Metrics are loaded from npm public APIs."}
          </p>
        </section>

        <section className="feature-panel trust-panel" aria-label="Trust and product guarantees">
          <div className="feature-panel__top">
            <div>
              <h2>Why teams trust Luthor</h2>
              <p>Every claim here is mapped to public docs or repository metadata.</p>
            </div>
          </div>

          <div className="trust-proof-grid" role="list" aria-label="Evidence-backed trust cards">
            {TRUST_PROOF_ITEMS.map((item) => (
              <article key={item.title} className="feature-group trust-proof-card" role="listitem">
                <div className="feature-group__header">
                  <h3>{item.title}</h3>
                  <span>Verified</span>
                </div>
                <p className="docs-card__summary">{item.summary}</p>
                <div className="docs-card__links">
                  {item.references.map((reference) => (
                    <a key={reference.href} href={reference.href} target="_blank" rel="noreferrer">
                      {reference.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
