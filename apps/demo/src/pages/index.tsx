import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { PACKAGE_DEFINITIONS, REPOSITORY_URL } from "../data/siteContent";
import { usePackageStats } from "../hooks/usePackageStats";

export default function HomePage() {
  const { totalWeeklyDownloads, packageStats } = usePackageStats();
  const luthorStats = packageStats.find((entry) => entry.packageName === "@lyfie/luthor");
  const headlessStats = packageStats.find((entry) => entry.packageName === "@lyfie/luthor-headless");

  return (
    <Layout
      title="Luthor Editor — MIT Open Source Rich Text Editor"
      description="Luthor and Luthor Headless: free forever MIT-licensed rich text editor packages built on Lexical for React applications."
    >
      <main className="container margin-vert--lg">
        <header className="hero hero--primary">
          <div className="container">
            <h1 className="hero__title">Luthor Rich Text Editor</h1>
            <p className="hero__subtitle">Preset speed with headless control, both MIT licensed and free forever.</p>
            <div className="demo-actions-row">
              <Link className="button button--secondary button--lg" to="/demo">
                Open Demo
              </Link>
              <Link className="button button--secondary button--lg" to="/docs">
                Read Docs
              </Link>
            </div>
          </div>
        </header>

        <section className="margin-top--lg">
          <h2>Package Paths</h2>
          <div className="grid cards-grid">
            <article className="card card-surface">
              <div className="card__header">
                <h3>@lyfie/luthor</h3>
              </div>
              <div className="card__body">
                <p>Preset editor. Fastest route to production.</p>
                <p>{luthorStats?.version ? `Latest version ${luthorStats.version}` : "Version tracked from npm"}</p>
              </div>
              <div className="card__footer">
                <a className="button button--primary" href={PACKAGE_DEFINITIONS[0].npmUrl} target="_blank" rel="noreferrer">
                  Install Luthor
                </a>
              </div>
            </article>

            <article className="card card-surface">
              <div className="card__header">
                <h3>@lyfie/luthor-headless</h3>
              </div>
              <div className="card__body">
                <p>Headless runtime for fully custom editor products.</p>
                <p>{headlessStats?.version ? `Latest version ${headlessStats.version}` : "Version tracked from npm"}</p>
              </div>
              <div className="card__footer">
                <a className="button button--secondary" href={PACKAGE_DEFINITIONS[1].npmUrl} target="_blank" rel="noreferrer">
                  Install Headless
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="margin-top--lg">
          <h2>Proof Signals</h2>
          <ul>
            <li>
              {totalWeeklyDownloads > 0
                ? `${new Intl.NumberFormat("en", { notation: "compact" }).format(totalWeeklyDownloads)} weekly installs`
                : "Live npm metrics loading"}
            </li>
            <li>MIT license and open-source repository</li>
            <li>React 18/19 and Lexical foundation</li>
            <li>Type-safe extension model</li>
          </ul>
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            View Repository
          </a>
        </section>
      </main>
    </Layout>
  );
}