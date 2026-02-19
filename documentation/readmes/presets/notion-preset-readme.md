# Notion preset

Block-focused writing preset with spacious content flow and command-driven editing.

## Exports

- `notionPreset` from `@lyfie/luthor`
- `NotionEditor` from `@lyfie/luthor`
- Source export: `src/presets/notion/index.ts`

## Preset metadata

- `id`: `notion`
- `label`: `Notion`
- `css`: `notion/styles.css`
- `default placeholder`: `Type '/' for commands...`
- `components.Editor`: `NotionEditor`

## Usage

```tsx
import { NotionEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function WorkspaceEditor() {
  return <NotionEditor />;
}
```

## Related docs

- Package README: [../../../packages/luthor/README.md](../../../packages/luthor/README.md)
- Monorepo README: [../../../README.md](../../../README.md)
- Docs hub: [../../documentation-hub.md](../../documentation-hub.md)
