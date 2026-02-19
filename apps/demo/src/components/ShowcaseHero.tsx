interface ShowcaseHeroProps {
  extensionCount: number;
  totalFeatureGroups: number;
  densestGroupTitle: string;
}

export function ShowcaseHero({ extensionCount, totalFeatureGroups, densestGroupTitle }: ShowcaseHeroProps) {
  return (
    <section className="hero-panel" aria-label="Luthor extensive editor showcase">
      <p className="demo-kicker">Headless + Plug-and-Play</p>
      <h1>
        Build rich editor experiences with a clean, modern,
        <span> production-ready foundation.</span>
      </h1>
      <p>
        This demo mirrors a premium product-site feel while exposing every key capability in the Extensive Editor baseline. Use the
        controls and the live canvas below to validate UX, output quality, and extension coverage in one place.
      </p>

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
      </div>
    </section>
  );
}
