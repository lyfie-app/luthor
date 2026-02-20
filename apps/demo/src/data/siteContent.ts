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

export const DOCS_LINKS = {
  license: "https://github.com/lyfie-app/luthor/blob/main/LICENSE",
  rootReadme: "https://github.com/lyfie-app/luthor/blob/main/README.md",
  packageLuthorReadme: "https://github.com/lyfie-app/luthor/blob/main/packages/luthor/README.md",
  packageHeadlessReadme: "https://github.com/lyfie-app/luthor/blob/main/packages/headless/README.md",
  hub: "https://github.com/lyfie-app/luthor/blob/main/documentation/documentation-hub.md",
  index: "https://github.com/lyfie-app/luthor/blob/main/documentation/index.md",
  luthorGettingStarted: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/luthor/getting-started.md",
  luthorPresets: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/luthor/presets-and-configuration.md",
  extensiveEditorGuide: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/luthor/extensive-editor.md",
  headlessGettingStarted: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/headless/getting-started.md",
  headlessExtensions: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/headless/extensions-and-configuration.md",
  importExport: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/headless/import-export.md",
  demoGettingStarted: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/demo/getting-started.md",
  demoPersistence: "https://github.com/lyfie-app/luthor/blob/main/documentation/user/demo/usage-and-persistence.md",
  developerDemoArchitecture: "https://github.com/lyfie-app/luthor/blob/main/documentation/developer/demo/architecture.md",
  developerLuthorArchitecture: "https://github.com/lyfie-app/luthor/blob/main/documentation/developer/luthor/architecture.md",
  developerHeadlessArchitecture: "https://github.com/lyfie-app/luthor/blob/main/documentation/developer/headless/architecture.md",
  developerLuthorMaintainerNotes: "https://github.com/lyfie-app/luthor/blob/main/documentation/developer/luthor/maintainer-notes.md",
  projectDeliverables: "https://github.com/lyfie-app/luthor/blob/main/documentation/PROJECT-DELIVERABLES.md",
};

export type DocsAudience = "user" | "developer" | "tutorials";

type DocsLinkEntry = {
  label: string;
  href: string;
};

export const DOCS_AUDIENCE_TRACKS: Record<
  DocsAudience,
  {
    title: string;
    subtitle: string;
    links: DocsLinkEntry[];
  }
> = {
  user: {
    title: "User Docs",
    subtitle: "Onboarding and feature workflows for integrating editors into product UIs.",
    links: [
      { label: "Luthor Getting Started", href: DOCS_LINKS.luthorGettingStarted },
      { label: "Luthor Presets & Configuration", href: DOCS_LINKS.luthorPresets },
      { label: "Extensive Editor Guide", href: DOCS_LINKS.extensiveEditorGuide },
      { label: "Headless Getting Started", href: DOCS_LINKS.headlessGettingStarted },
      { label: "Headless Extensions & Config", href: DOCS_LINKS.headlessExtensions },
      { label: "Headless Import / Export", href: DOCS_LINKS.importExport },
      { label: "Demo Getting Started", href: DOCS_LINKS.demoGettingStarted },
      { label: "Demo Usage & Persistence", href: DOCS_LINKS.demoPersistence },
    ],
  },
  developer: {
    title: "Developer Docs",
    subtitle: "Architecture, source reference, and maintainer-level implementation guidance.",
    links: [
      { label: "Demo Architecture", href: DOCS_LINKS.developerDemoArchitecture },
      { label: "Luthor Architecture", href: DOCS_LINKS.developerLuthorArchitecture },
      { label: "Headless Architecture", href: DOCS_LINKS.developerHeadlessArchitecture },
      { label: "Luthor Maintainer Notes", href: DOCS_LINKS.developerLuthorMaintainerNotes },
      { label: "Project Deliverables", href: DOCS_LINKS.projectDeliverables },
      { label: "Documentation Hub", href: DOCS_LINKS.hub },
      { label: "Documentation Index", href: DOCS_LINKS.index },
    ],
  },
  tutorials: {
    title: "Tutorials & Reference",
    subtitle: "Practical recipes for persistence, import/export, and production rollouts.",
    links: [
      { label: "Headless Import / Export", href: DOCS_LINKS.importExport },
      { label: "Demo Usage & Persistence", href: DOCS_LINKS.demoPersistence },
      { label: "Documentation Hub", href: DOCS_LINKS.hub },
      { label: "Repository README", href: `${REPOSITORY_URL}#readme` },
    ],
  },
};

export const DOCS_START_HERE = [
  {
    title: "I need a production editor quickly",
    description: "Start with the Extensive preset editor and customize incrementally.",
    links: [
      { label: "Luthor Getting Started", href: DOCS_LINKS.luthorGettingStarted },
      { label: "Extensive Editor Guide", href: DOCS_LINKS.extensiveEditorGuide },
    ],
  },
  {
    title: "I need deep customization and control",
    description: "Use the headless package and compose typed extension workflows from scratch.",
    links: [
      { label: "Headless Getting Started", href: DOCS_LINKS.headlessGettingStarted },
      { label: "Extensions & Configuration", href: DOCS_LINKS.headlessExtensions },
    ],
  },
  {
    title: "I need robust persistence and conversion",
    description: "Implement JSONB-first persistence with reversible visual/editor workflows.",
    links: [
      { label: "Import / Export Guide", href: DOCS_LINKS.importExport },
      { label: "Demo Usage & Persistence", href: DOCS_LINKS.demoPersistence },
    ],
  },
];

export const DOCS_CAPABILITY_MATRIX = [
  {
    capability: "Fastest onboarding",
    luthor: "Best fit",
    headless: "Requires setup",
    evidence: DOCS_LINKS.luthorGettingStarted,
  },
  {
    capability: "Preset extensive editor",
    luthor: "Included",
    headless: "Build manually",
    evidence: DOCS_LINKS.extensiveEditorGuide,
  },
  {
    capability: "Extension-level control",
    luthor: "Available via headless exports",
    headless: "Core model",
    evidence: DOCS_LINKS.headlessExtensions,
  },
  {
    capability: "Import / export fidelity",
    luthor: "Supported",
    headless: "Supported",
    evidence: DOCS_LINKS.importExport,
  },
  {
    capability: "Best for",
    luthor: "Plug-and-play product teams",
    headless: "Custom editor platform teams",
    evidence: DOCS_LINKS.hub,
  },
] as const;

export const TRUST_PROOF_ITEMS = [
  {
    title: "MIT + Open Source + Free Forever",
    summary: "Use in commercial and personal projects under a permissive MIT license.",
    references: [
      { label: "License", href: DOCS_LINKS.license },
      { label: "Repository README", href: DOCS_LINKS.rootReadme },
    ],
  },
  {
    title: "React + Lexical foundation",
    summary: "Built for React ecosystems and powered by Meta's Lexical architecture.",
    references: [
      { label: "Luthor README", href: DOCS_LINKS.packageLuthorReadme },
      { label: "Headless README", href: DOCS_LINKS.packageHeadlessReadme },
    ],
  },
  {
    title: "Type-safe and extension-driven",
    summary: "Headless extension composition is documented with typed configuration patterns.",
    references: [
      { label: "Headless extensions docs", href: DOCS_LINKS.headlessExtensions },
      { label: "Headless getting started", href: DOCS_LINKS.headlessGettingStarted },
    ],
  },
  {
    title: "Security-conscious data flows",
    summary: "Import/export and URL handling guidance emphasizes validation and safe usage.",
    references: [
      { label: "Import / export guide", href: DOCS_LINKS.importExport },
      { label: "Project deliverables", href: DOCS_LINKS.projectDeliverables },
    ],
  },
  {
    title: "Performance and conversion fidelity",
    summary: "Visual and JSONB workflows are designed for reliable round-trips.",
    references: [
      { label: "Import / export guide", href: DOCS_LINKS.importExport },
      { label: "Extensive editor guide", href: DOCS_LINKS.extensiveEditorGuide },
    ],
  },
] as const;
