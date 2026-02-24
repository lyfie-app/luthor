---
title: Get Started @lyfie/luthor-headless
description: Minimal setup and validation for the headless package.
---

# Get Started @lyfie/luthor-headless

Use this when you need full control over editor UI.

## 1) Install

```bash
npm install @lyfie/luthor-headless lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils react react-dom
```

## 2) Render a minimal headless editor

```tsx
import {
  createEditorSystem,
  RichText,
  richTextExtension,
  boldExtension,
  italicExtension,
} from '@lyfie/luthor-headless';

const extensions = [richTextExtension, boldExtension, italicExtension] as const;
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

function Toolbar() {
  const { commands, activeStates } = useEditor();

  return (
    <div>
      <button onClick={() => commands.toggleBold()} aria-pressed={activeStates.bold}>Bold</button>
      <button onClick={() => commands.toggleItalic()} aria-pressed={activeStates.italic}>Italic</button>
    </div>
  );
}

export function App() {
  return (
    <Provider extensions={extensions}>
      <Toolbar />
      <RichText placeholder="Write here..." />
    </Provider>
  );
}
```

## 3) Validate installation

If this works, installation is valid:

- Text area mounts
- Buttons execute bold/italic commands
- No missing peer dependency errors for Lexical packages

## Quick validation checklist

- All required `lexical` and `@lexical/*` peers are installed
- `createEditorSystem` provider wraps your editor UI
- Commands and active states are accessible from `useEditor()`

## Next

- [Headless Features](/docs/luthor-headless/features/)

