---
title: ChatWindowEditor
description: Usage and props for the ChatWindowEditor preset.
---

# ChatWindowEditor

Chat composer style preset with send/action controls.

## Usage

```tsx
import { ChatWindowEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return (
    <ChatWindowEditor
      onSend={({ jsonb }) => console.log(jsonb)}
      submitOnEnter
      allowShiftEnter
    />
  );
}
```

## Props

`ChatWindowEditorProps`:

- Inherits `ExtensiveEditorProps`
- Excludes: `featureFlags`, `isToolbarEnabled`
- Adds:
  - `onSend?: (payload: { jsonb: string }) => void`
  - `submitOnEnter?: boolean`
  - `allowShiftEnter?: boolean`
  - `showVoiceButton?: boolean`
  - `showImageButton?: boolean`
  - `showSendButton?: boolean`

## Behavior

- Toolbar is disabled by preset defaults
- Visual mode only
- Enter-to-send can be configured

