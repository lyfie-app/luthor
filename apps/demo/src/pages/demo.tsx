import Layout from "@theme/Layout";
import { EXTENSIVE_DEMO_MARKDOWN } from "../data/demoContent";

export default function DemoPage() {
  return (
    <Layout
      title="Live Extensive Editor Demo — Luthor"
      description="Try the Extensive Editor live and evaluate extension coverage, UX workflows, and export fidelity."
    >
      <main className="container margin-vert--lg">
        <header>
          <p>Live Demo</p>
          <h1>Extensive Editor, instantly testable</h1>
          <p>Validate visual editing, JSONB workflow, and editor UX behavior in one place.</p>
        </header>

        <section className="margin-top--md">
          <h2>Demo Seed Document</h2>
          <p>
            The same dense showcase content from the previous SPA demo is kept below for quick copy/paste into the
            Extensive Editor.
          </p>
          <pre>
            <code>{EXTENSIVE_DEMO_MARKDOWN}</code>
          </pre>
        </section>

        <section className="margin-top--lg">
          <h2>Workflow Coverage</h2>
          <ul>
            <li>Visual ↔ JSONB reversible editing</li>
            <li>Command palette, slash menu, and context menu</li>
            <li>Formatting depth: text, structure, table, code, media</li>
            <li>Persistence pattern based on JSONB payloads</li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}