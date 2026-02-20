import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Luthor",
  tagline: "Open source rich-text editor for React and Lexical",
  favicon: "img/logo.svg",

  future: {
    v4: true,
  },

  url: "https://lyfie-app.github.io",
  baseUrl: "/",
  organizationName: "lyfie-app",
  projectName: "luthor",

  onBrokenLinks: "warn",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "../../documentation",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/logo.svg",
    navbar: {
      title: "Luthor",
      items: [
        { to: "/", label: "Home", position: "left" },
        { to: "/demo", label: "Demo", position: "left" },
        { to: "/ecosystem", label: "Ecosystem", position: "left" },
        { to: "/docs", label: "Docs", position: "left" },
        {
          href: "https://github.com/lyfie-app/luthor",
          label: "GitHub",
          position: "right",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;