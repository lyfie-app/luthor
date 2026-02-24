---
title: HeadlessEditorPreset
description: Usage and props for the HeadlessEditorPreset preset.
---

# HeadlessEditorPreset

Small reference preset demonstrating direct headless composition.

## Usage

```tsx
import { HeadlessEditorPreset } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <HeadlessEditorPreset placeholder="Start writing..." />;
}
```

## Props

`HeadlessEditorPresetProps`:

- `className?: string`
- `placeholder?: string`

## Behavior

Uses a minimal extension set (`richText`, `history`, `bold`, `italic`, `underline`, `list`) and a lightweight toolbar.

