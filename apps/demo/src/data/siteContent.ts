export const REPOSITORY_URL = "https://github.com/lyfie-app/luthor";
export const ISSUES_URL = "https://github.com/lyfie-app/luthor/issues";
export const SPONSOR_URL = "https://github.com/sponsors/lyfie-app";

export const PACKAGE_DEFINITIONS = [
  {
    packageName: "@lyfie/luthor",
    npmUrl: "https://www.npmjs.com/package/@lyfie/luthor",
    description: "Plug-and-play preset editor with the Extensive Editor out of the box.",
  },
  {
    packageName: "@lyfie/luthor-headless",
    npmUrl: "https://www.npmjs.com/package/@lyfie/luthor-headless",
    description: "Headless, extension-driven editor foundation for full UI and workflow control.",
  },
] as const;

export const TRUST_PROOF_ITEMS = [
  {
    title: "MIT + Open Source + Free Forever",
    summary: "Use in commercial and personal projects under a permissive MIT license.",
    references: [
      { label: "License", href: `${REPOSITORY_URL}/blob/main/LICENSE` },
      { label: "Repository README", href: `${REPOSITORY_URL}/blob/main/README.md` },
    ],
  },
  {
    title: "React + Lexical foundation",
    summary: "Built for React ecosystems and powered by Meta's Lexical architecture.",
    references: [
      { label: "Luthor README", href: `${REPOSITORY_URL}/blob/main/packages/luthor/README.md` },
      { label: "Headless README", href: `${REPOSITORY_URL}/blob/main/packages/headless/README.md` },
    ],
  },
  {
    title: "Type-safe and extension-driven",
    summary: "Headless extension composition is documented with typed configuration patterns.",
    references: [
      {
        label: "Headless extensions docs",
        href: `${REPOSITORY_URL}/blob/main/documentation/user/headless/extensions-and-configuration.md`,
      },
      {
        label: "Headless getting started",
        href: `${REPOSITORY_URL}/blob/main/documentation/user/headless/getting-started.md`,
      },
    ],
  },
] as const;
