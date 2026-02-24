---
title: NotionLikeEditor
description: Usage and props for the NotionLikeEditor preset.
---

# NotionLikeEditor

Slash-first preset with draggable-focused defaults.

## Usage

```tsx
import { NotionLikeEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <NotionLikeEditor isDraggableEnabled slashVisibility={{ allowlist: ['block.paragraph'] }} />;
}
```

## Props

`NotionLikeEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `featureFlags`, `isToolbarEnabled`
- Adds:
  - `slashVisibility?: SlashCommandVisibility`
  - `isDraggableEnabled?: boolean`
  - `featureFlags?: FeatureFlagOverrides`
  - `isToolbarEnabled?: boolean`

## Behavior

Defaults enable slash commands + draggable blocks + command palette with toolbar hidden by default.

