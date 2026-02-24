---
title: EmailComposeEditor
description: Usage and props for the EmailComposeEditor preset.
---

# EmailComposeEditor

Email composer preset with To/Cc/Bcc/Subject shell.

## Usage

```tsx
import { EmailComposeEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <EmailComposeEditor showCc showBcc />;
}
```

## Props

`EmailComposeEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `featureFlags`
- Adds:
  - `showTo?: boolean`
  - `showCc?: boolean`
  - `showBcc?: boolean`
  - `showSubject?: boolean`

## Behavior

Preset applies email-friendly feature defaults and renders compose header fields.

