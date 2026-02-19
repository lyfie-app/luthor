# Chat preset

Conversation-first full editor preset with compact visual spacing and markdown mode.

## Export

- `chatPreset` from `@lyfie/luthor`
- `ChatEditor` from `@lyfie/luthor`
- Source export: `src/presets/chat/index.ts`

## Preset metadata

- `id`: `chat`
- `label`: `Chat`
- `description`: `Conversation-first editor with compact spacing and fast markdown fallback.`
- `css`: `chat/styles.css`
- `default placeholder`: `Write a message...`
- `components.Editor`: `ChatEditor`

## Default toolbar

Same as extensive preset (`extensiveToolbar`).

## Usage

```tsx
import { ChatEditor } from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";

export function ChatComposer() {
  return <ChatEditor placeholder="Write a message..." />;
}
```

## Related docs

- Package README: [../../../packages/luthor/README.md](../../../packages/luthor/README.md)
- Monorepo README: [../../../README.md](../../../README.md)
- Docs hub: [../../documentation-hub.md](../../documentation-hub.md)


