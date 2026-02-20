interface FeatureGroup {
  title: string;
  items: string[];
}

interface FeatureCoveragePanelProps {
  extensionCount: number;
  totalFeatureGroups: number;
  groupedFeatures: FeatureGroup[];
  copyButtonLabel: string;
  onCopyMarkdown: () => void;
  titleFromExtensionKey: (value: string) => string;
}

export function FeatureCoveragePanel({
  extensionCount,
  totalFeatureGroups,
  groupedFeatures,
  copyButtonLabel,
  onCopyMarkdown,
  titleFromExtensionKey,
}: FeatureCoveragePanelProps) {
  return (
    <section className="feature-panel" aria-label="Current extensive editor feature coverage">
      <div className="feature-panel__top">
        <div>
          <h2>Available capabilities</h2>
          <p>
            {extensionCount} active extensions grouped into {totalFeatureGroups} categories.
          </p>
        </div>
        <div className="feature-panel__actions">
          <button type="button" className="demo-button demo-button--ghost" onClick={onCopyMarkdown}>
            {copyButtonLabel}
          </button>
        </div>
      </div>

      <div className="feature-grid">
        {groupedFeatures.map((group) => (
          <article key={group.title} className="feature-group">
            <div className="feature-group__header">
              <h3>{group.title}</h3>
              <span>{group.items.length}</span>
            </div>
            <div className="feature-chips">
              {group.items.map((item) => (
                <span key={item} className="feature-chip">
                  {titleFromExtensionKey(item)}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
