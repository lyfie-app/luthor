# Themed preset

Theme-token-driven preset for product teams that need deep style control.

## Exports

- `themedPreset` from `@lyfie/luthor`
- `ThemedEditor` from `@lyfie/luthor`
- Source export: `src/presets/themed/index.ts`

## Preset metadata

- `id`: `themed`
- `label`: `Themed`
- `css`: `themed/styles.css`
- `default placeholder`: `Start writing with theme tokens...`
- `components.Editor`: `ThemedEditor`

## Styling model

The preset maps overridable user variables like `--luthor-themed-accent` onto runtime editor variables, so users can restyle without editing source files.

## Usage

```tsx
import { ThemedEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function BrandEditor() {
  return <ThemedEditor className="my-brand-editor" />;
}
```

## Related docs

- Package README: [../../../packages/luthor/README.md](../../../packages/luthor/README.md)
- Monorepo README: [../../../README.md](../../../README.md)
- Docs hub: [../../documentation-hub.md](../../documentation-hub.md)
