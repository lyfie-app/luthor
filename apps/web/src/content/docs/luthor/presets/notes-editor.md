---
title: NotesEditor
description: Usage and props for the NotesEditor preset.
---

# NotesEditor

Notes-style preset with title and action controls.

## Usage

```tsx
import { NotesEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return (
    <NotesEditor
      showTitle
      title="Sprint Notes"
      onTitleChange={(value) => console.log(value)}
      onPin={() => console.log('pin')}
      onArchive={() => console.log('archive')}
    />
  );
}
```

## Props

`NotesEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `featureFlags`
- Adds:
  - `showTitle?: boolean`
  - `title?: string`
  - `onTitleChange?: (value: string) => void`
  - `showActions?: boolean`
  - `onPin?: () => void`
  - `onArchive?: () => void`
  - `onColorChange?: (color: string) => void`
  - `colorOptions?: readonly string[]`

## Behavior

Toolbar is disabled by preset default and feature set is tuned for lightweight note taking.

