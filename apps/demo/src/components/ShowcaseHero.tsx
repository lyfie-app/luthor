import { Link } from "react-router-dom";

interface ShowcaseHeroProps {
  extensionCount: number;
  totalFeatureGroups: number;
  densestGroupTitle: string;
  totalWeeklyDownloads: number;
  installUrl: string;
  repositoryUrl: string;
}

export function ShowcaseHero({
  extensionCount,
  totalFeatureGroups,
  densestGroupTitle,
  totalWeeklyDownloads,
  installUrl,
  repositoryUrl,
}: ShowcaseHeroProps) {
  return (
    <section className="hero-panel" aria-label="Luthor extensive editor showcase">
      <p className="demo-kicker">Open Source • MIT • Free Forever</p>
      <h1>
        Build production editors.
        <span> In minutes, not weeks.</span>
      </h1>
      <p>
        Built on Lexical. Type-safe by default. Plug-and-play with full headless control when you need it.
      </p>

      <div className="hero-value-points" role="list" aria-label="Core value points">
        <span className="feature-chip" role="listitem">🧠 Built on Lexical</span>
        <span className="feature-chip" role="listitem">🔒 Type Safe</span>
        <span className="feature-chip" role="listitem">⚡ Plug & Play + Headless</span>
        <span className="feature-chip" role="listitem">🧩 Headless: zero mandatory deps beyond Lexical + React peers</span>
        <span className="feature-chip" role="listitem">
          <span className="live-dot" aria-hidden="true" /> Weekly installs live
        </span>
      </div>

      <div className="hero-cta" role="group" aria-label="Primary conversion actions">
        <Link className="demo-button" to="/demo">
          Try Live Demo
        </Link>
        <a className="demo-button demo-button--ghost" href={installUrl} target="_blank" rel="noreferrer">
          Install from npm
        </a>
        <a className="demo-button demo-button--ghost" href={repositoryUrl} target="_blank" rel="noreferrer">
          View GitHub
        </a>
      </div>

      <div className="hero-stats" role="list" aria-label="Core showcase metrics">
        <article className="stat-card" role="listitem">
          <p>Extensions</p>
          <strong>{extensionCount}</strong>
        </article>
        <article className="stat-card" role="listitem">
          <p>Feature groups</p>
          <strong>{totalFeatureGroups}</strong>
        </article>
        <article className="stat-card" role="listitem">
          <p>Densest area</p>
          <strong>{densestGroupTitle}</strong>
        </article>
        <article className="stat-card" role="listitem">
          <p>Weekly npm downloads</p>
          <strong>{totalWeeklyDownloads > 0 ? new Intl.NumberFormat("en", { notation: "compact" }).format(totalWeeklyDownloads) : "Loading"}</strong>
        </article>
      </div>
    </section>
  );
}
