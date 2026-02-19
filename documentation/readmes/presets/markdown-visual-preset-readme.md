# Markdown / Visual preset

Markdown-first preset that preserves a live visual mode for round-trip editing.

## Exports

- `markdownVisualPreset` from `@lyfie/luthor`
- `MarkdownVisualEditor` from `@lyfie/luthor`
- Source export: `src/presets/markdown-visual/index.ts`

## Preset metadata

- `id`: `markdownVisual`
- `label`: `Markdown / Visual`
- `css`: `markdown-visual/styles.css`
- `default placeholder`: `Write in markdown...`
- `components.Editor`: `MarkdownVisualEditor`

## Mode behavior

- Available modes: `visual`, `markdown`
- Initial mode: `markdown`

## Usage

```tsx
import { MarkdownVisualEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function DocsComposer() {
  return <MarkdownVisualEditor />;
}
```

## Related docs

- Package README: [../../../packages/luthor/README.md](../../../packages/luthor/README.md)
- Monorepo README: [../../../README.md](../../../README.md)
- Docs hub: [../../documentation-hub.md](../../documentation-hub.md)
