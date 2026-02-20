import Layout from "@theme/Layout";
import { ISSUES_URL, PACKAGE_DEFINITIONS, REPOSITORY_URL, SPONSOR_URL, TRUST_PROOF_ITEMS } from "../data/siteContent";
import { formatCompactNumber, formatUnpackedSize, usePackageStats } from "../hooks/usePackageStats";

export default function EcosystemPage() {
  const { packageStats, packageStatsStatus } = usePackageStats();

  return (
    <Layout
      title="Ecosystem & npm Metrics — Luthor"
      description="Explore package links, weekly npm downloads, version data, and open-source ecosystem trust signals."
    >
      <main className="container margin-vert--lg">
        <header>
          <p>Ecosystem</p>
          <h1>Choose the editor stack teams can trust</h1>
          <p>Evaluate momentum, package quality, and evidence-backed engineering claims in one place.</p>
        </header>

        <section className="margin-top--md">
          <div className="demo-actions-row">
            <a className="button button--secondary" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              GitHub Repo
            </a>
            <a className="button button--secondary" href={ISSUES_URL} target="_blank" rel="noreferrer">
              Report Issue
            </a>
            <a className="button button--primary" href={SPONSOR_URL} target="_blank" rel="noreferrer">
              Donate / Sponsor
            </a>
          </div>
        </section>

        <section className="margin-top--lg">
          <h2>npm package metrics</h2>
          <div className="grid cards-grid">
            {packageStats.map((entry) => (
              <article key={entry.packageName} className="card card-surface">
                <div className="card__header">
                  <h3>{entry.packageName}</h3>
                </div>
                <div className="card__body">
                  <p>{entry.description}</p>
                  <ul>
                    <li>Weekly downloads: {entry.weeklyDownloads ? formatCompactNumber(entry.weeklyDownloads) : "N/A"}</li>
                    <li>Latest version: {entry.version ?? "N/A"}</li>
                    <li>Unpacked size: {formatUnpackedSize(entry.unpackedSize)}</li>
                  </ul>
                </div>
                <div className="card__footer">
                  <a href={PACKAGE_DEFINITIONS.find((item) => item.packageName === entry.packageName)?.npmUrl ?? "#"} target="_blank" rel="noreferrer">
                    View on npm
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p>
            {packageStatsStatus === "loading" && "Fetching live npm metrics..."}
            {packageStatsStatus === "error" && "Unable to fetch live metrics right now. External links remain available."}
            {packageStatsStatus === "ready" && "Metrics are loaded from npm public APIs."}
          </p>
        </section>

        <section className="margin-top--lg">
          <h2>Why teams trust Luthor</h2>
          <div className="grid cards-grid">
            {TRUST_PROOF_ITEMS.map((item) => (
              <article key={item.title} className="card card-surface">
                <div className="card__header">
                  <h3>{item.title}</h3>
                </div>
                <div className="card__body">
                  <p>{item.summary}</p>
                </div>
                <div className="card__footer">
                  {item.references.map((reference) => (
                    <a key={reference.href} href={reference.href} target="_blank" rel="noreferrer" className="margin-right--sm">
                      {reference.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}