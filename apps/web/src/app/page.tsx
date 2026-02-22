import Link from 'next/link';
import metadata from '@/data/package-metadata.json';
import { CopyInstallButton } from '@/components/copy-install-button';
import { ExtensiveEditorShell } from '@/components/extensive-editor-shell';
import { HomeJsonLd } from '@/components/home-json-ld';
import { formatBytes, formatCompact } from '@/lib/format';

const valueProps = [
  {
    title: 'MIT Licensed and Free Forever',
    description:
      'Modify everything. Own your editor. Luthor is open source, commercially friendly, and built to stay out of paywalls.',
    proof: 'Open forever, no lock-in',
  },
  {
    title: 'Lexical Core Logic',
    description:
      "Luthor derives runtime behavior from Meta's Lexical framework for fast input handling and resilient editing state.",
    proof: 'Engineered for responsiveness',
  },
  {
    title: 'Type-Safe and Secure',
    description:
      'TypeScript-first APIs and regular maintenance updates keep integrations stable while reducing unexpected runtime drift.',
    proof: 'Stable today, safer upgrades',
  },
  {
    title: 'Headless or Plug-and-Play',
    description:
      'Use @lyfie/luthor-headless for full logic control, or @lyfie/luthor for a complete UI-first editor you can ship quickly.',
    proof: 'Freedom to choose your layer',
  },
];

const stats = {
  weeklyDownloads: formatCompact(metadata.metrics?.weeklyDownloads),
  latestVersion: metadata.metrics?.latestVersion ?? 'N/A',
  minzippedSize: formatBytes(metadata.metrics?.minzippedSizeBytes),
  githubStars: formatCompact(metadata.metrics?.githubStars),
};

const fetchedDate = metadata.fetchedAt ? new Date(metadata.fetchedAt).toLocaleString('en-US') : 'N/A';

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />

      <section className="section hero-stage">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Lexical-powered rich text editing</span>
            <h1 className="hero-title">The performance of Lexical, the simplicity of a single import.</h1>
            <p className="hero-copy">
              Luthor is a free, MIT-licensed React rich text editor with a plug-and-play extensive preset and a headless
              path for deeper customization.
            </p>
            <p className="hero-live-note">Try it now with the Extensive Editor preset.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/docs/getting-started/">
                Read docs
              </Link>
              <Link className="btn btn-muted" href="/demo/">
                Open full demo
              </Link>
            </div>
          </div>

          <div className="browser-frame">
            <div className="browser-frame-header">
              <div className="window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="install-row">
                <code className="install-chip">npm install @lyfie/luthor react react-dom</code>
                <CopyInstallButton />
              </div>
            </div>
            <div className="editor-pane">
              <ExtensiveEditorShell />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Trust, freedom, and technical credibility.</h2>
          <p className="section-copy">
            Built for React developers who hate bloated editors. Start simple, then customize every part of the stack when
            you need deeper control.
          </p>
          <div className="value-grid">
            {valueProps.map((item) => (
              <article className="value-card" key={item.title}>
                <p className="value-proof">{item.proof}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <p className="value-tailline">Free forever. Open forever. Stable today.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Social proof and package momentum.</h2>
          <p className="section-copy">
            Package metadata is fetched at build time and exposed as compact badges for fast credibility checks.
          </p>
          <div className="stats-badge-row">
            <article className="metric metric-badge">
              <p className="metric-label">Weekly downloads</p>
              <p className="metric-value">{stats.weeklyDownloads}</p>
            </article>
            <article className="metric metric-badge">
              <p className="metric-label">Version</p>
              <p className="metric-value">{stats.latestVersion}</p>
            </article>
            <article className="metric metric-badge">
              <p className="metric-label">Bundle size</p>
              <p className="metric-value">{stats.minzippedSize}</p>
            </article>
            <article className="metric metric-badge">
              <p className="metric-label">GitHub stars</p>
              <p className="metric-value">{stats.githubStars}</p>
            </article>
          </div>
          <div className="link-row">
            <a className="btn btn-muted" href={metadata.npmUrl} target="_blank" rel="noopener noreferrer">
              NPM package
            </a>
            <a className="btn btn-muted" href={metadata.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>
            <a className="btn btn-primary" href={metadata.sponsorsUrl} target="_blank" rel="noopener noreferrer">
              Support the project
            </a>
          </div>
          <p className="mono-small">
            Data sources: npm downloads API, npm registry API, Bundlephobia API, GitHub API. Last sync: {fetchedDate}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container keyword-strip">
          <h2 className="section-title">Built to rank for editor-focused intent.</h2>
          <p className="section-copy">
            Searching for <strong>Luthor editor</strong>, <strong>Lexical rich text editor</strong>,{' '}
            <strong>best React based text editor</strong>, or <strong>best free open source rich text editor</strong> should
            lead developers to this project, with clear documentation and verifiable implementation details.
          </p>
        </div>
      </section>
    </>
  );
}
