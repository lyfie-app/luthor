# @lyfie/luthor

Batteries-included presets and UI-ready editor experience built on top of `@lyfie/luthor-headless`.

## Package Responsibility

- `@lyfie/luthor-headless` owns all Lexical-derived editor features and extension internals.
- `@lyfie/luthor` composes presets, UI, and ready-to-use editor experiences on top of headless.
- `@lyfie/luthor` re-exports headless APIs via a namespace export so consumers can access core capabilities from one package.

## Installation

```bash
# npm
npm install @lyfie/luthor

# pnpm
pnpm add @lyfie/luthor
```

`@lyfie/luthor` includes Lexical packages as dependencies, so you do not need to install `lexical` and `@lexical/*` separately when using this package.

## Quick Start

```tsx
import { ExtensiveEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function App() {
  return <ExtensiveEditor placeholder="Start writing..." />;
}
```

### Accessing headless APIs through `@lyfie/luthor`

```tsx
import { headless } from "@lyfie/luthor";

const { createEditorSystem, boldExtension } = headless;
```

## Exports

From `src/presets/index.ts`, this package exports:

- Presets: `chatPreset`, `emailPreset`, `markdownVisualPreset`, `htmlVisualPreset`, `themedPreset`, `notionPreset`, `extensivePreset`
- Registry: `presetRegistry`
- Preset editors: `ChatEditor`, `EmailEditor`, `MarkdownVisualEditor`, `HtmlVisualEditor`, `ThemedEditor`, `NotionEditor`, `ExtensiveEditor`
- Shared extensions: `extensiveExtensions`
- Helpers: `createPresetEditorConfig`

## React Peer Dependencies

- `react`: `^18.0.0 || ^19.0.0`
- `react-dom`: `^18.0.0 || ^19.0.0`

## Package Links

- Headless core package docs: [../headless/README.md](../headless/README.md)
- Package architecture docs: [../../documentation/readmes/packages/luthor-docs/README.md](../../documentation/readmes/packages/luthor-docs/README.md)
- Monorepo root docs: [../../README.md](../../README.md)
- Central docs index: [../../documentation/documentation-hub.md](../../documentation/documentation-hub.md)
- Developer README map: [../../documentation/developer_notes/readme-map.md](../../documentation/developer_notes/readme-map.md)

## Development (Workspace)

From repo root:

```bash
pnpm dev --filter @lyfie/luthor
pnpm build --filter @lyfie/luthor
pnpm lint --filter @lyfie/luthor
```
