import type { RouteRecord } from "vite-react-ssg";
import { Head } from "vite-react-ssg";
import App from "./App";
import { DocsPage } from "./pages/DocsPage";
import { EcosystemPage } from "./pages/EcosystemPage";
import { HomePage } from "./pages/HomePage";

function HomeRoute() {
  return (
    <>
      <Head>
        <title>Luthor Editor — MIT Open Source Rich Text Editor</title>
        <meta
          name="description"
          content="Luthor and Luthor Headless: free forever MIT-licensed rich text editor packages built on Lexical for React applications."
        />
      </Head>
      <HomePage />
    </>
  );
}

function DemoRoute() {
  return (
    <>
      <Head>
        <title>Live Extensive Editor Demo — Luthor</title>
        <meta
          name="description"
          content="Try the Extensive Editor live and evaluate extension coverage, UX workflows, and export fidelity."
        />
      </Head>
      <App />
    </>
  );
}

function DocsRoute() {
  return (
    <>
      <Head>
        <title>Documentation Paths — Luthor & Luthor Headless</title>
        <meta
          name="description"
          content="Start quickly with plug-and-play presets or build custom workflows with the headless extension architecture."
        />
      </Head>
      <DocsPage />
    </>
  );
}

function EcosystemRoute() {
  return (
    <>
      <Head>
        <title>Ecosystem & npm Metrics — Luthor</title>
        <meta
          name="description"
          content="Explore package links, weekly npm downloads, version data, and open-source ecosystem trust signals."
        />
      </Head>
      <EcosystemPage />
    </>
  );
}

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: HomeRoute,
  },
  {
    path: "/demo",
    Component: DemoRoute,
  },
  {
    path: "/docs",
    Component: DocsRoute,
  },
  {
    path: "/ecosystem",
    Component: EcosystemRoute,
  },
];
