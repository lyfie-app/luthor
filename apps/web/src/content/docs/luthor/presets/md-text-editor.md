---
title: MDTextEditor
description: Usage and props for the MDTextEditor preset.
---

# MDTextEditor

Preset that switches between Visual and Markdown editing.

## Usage

```tsx
import { MDTextEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <MDTextEditor initialMode="visual" />;
}
```

## Props

`MDTextEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `availableModes`, `initialMode`
- Adds:
  - `initialMode?: 'visual' | 'markdown'`

## Behavior

- Uses markdown/jsonb bridge for mode conversion
- Applies feature defaults suitable for markdown workflows

