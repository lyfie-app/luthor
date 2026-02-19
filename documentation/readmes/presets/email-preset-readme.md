# Email preset

Email drafting preset tuned for visual editing with HTML source mode.

## Export

- `emailPreset` from `@lyfie/luthor`
- `EmailEditor` from `@lyfie/luthor`
- Source export: `src/presets/email/index.ts`

## Preset metadata

- `id`: `email`
- `label`: `Email`
- `description`: `Email drafting surface focused on visual and HTML source workflows.`
- `css`: `email/styles.css`
- `default placeholder`: `Write an email...`
- `components.Editor`: `EmailEditor`

## Default toolbar

Same as extensive preset (`extensiveToolbar`).

## Usage

```tsx
import { EmailEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function EmailComposer() {
  return <EmailEditor placeholder="Write an email..." />;
}
```

## Related docs

- Package README: [../../../packages/luthor/README.md](../../../packages/luthor/README.md)
- Monorepo README: [../../../README.md](../../../README.md)
- Docs hub: [../../documentation-hub.md](../../documentation-hub.md)


