---
title: SimpleTextEditor
description: Usage and props for the SimpleTextEditor preset.
---

# SimpleTextEditor

Minimal/plain-text style preset built on top of `ExtensiveEditor`.

## Usage

```tsx
import { SimpleTextEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <SimpleTextEditor placeholder="Start writing..." />;
}
```

## Props

`SimpleTextEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `featureFlags`, `availableModes`, `initialMode`, `toolbarVisibility`
- Adds:
  - `hideToolbarByDefault?: boolean` (default `true`)

## Behavior

- Forces visual-only mode
- Disables most rich features by preset defaults

