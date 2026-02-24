---
title: RichTextBoxEditor
description: Usage and props for the RichTextBoxEditor preset.
---

# RichTextBoxEditor

Compact rich-text preset for focused editing.

## Usage

```tsx
import { RichTextBoxEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <RichTextBoxEditor compactToolbar />;
}
```

## Props

`RichTextBoxEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `featureFlags`
- Adds:
  - `featureFlags?: FeatureFlagOverrides`
  - `compactToolbar?: boolean`

## Behavior

Default feature flags enable core text formatting and disable heavier media/embed features unless re-enabled.

