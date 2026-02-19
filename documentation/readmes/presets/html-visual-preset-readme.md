# HTML / Visual preset

HTML-source-first preset with visual editing support for safer live previews.

## Exports

- `htmlVisualPreset` from `@lyfie/luthor`
- `HtmlVisualEditor` from `@lyfie/luthor`
- Source export: `src/presets/html-visual/index.ts`

## Preset metadata

- `id`: `htmlVisual`
- `label`: `HTML / Visual`
- `css`: `html-visual/styles.css`
- `default placeholder`: `Compose with HTML preview...`
- `components.Editor`: `HtmlVisualEditor`

## Mode behavior

- Available modes: `visual`, `html`
- Initial mode: `html`

## Usage

```tsx
import { HtmlVisualEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function HtmlComposer() {
  return <HtmlVisualEditor />;
}
```

## Related docs

- Package README: [../../../packages/luthor/README.md](../../../packages/luthor/README.md)
- Monorepo README: [../../../README.md](../../../README.md)
- Docs hub: [../../documentation-hub.md](../../documentation-hub.md)
