---
title: Get Started @lyfie/luthor
description: Minimal setup and validation for the preset package.
---

# Get Started @lyfie/luthor

Use this when you want a ready-to-use editor quickly.

## 1) Install

```bash
npm install @lyfie/luthor react react-dom
```

## 2) Render a basic editor

```tsx
import { ExtensiveEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <ExtensiveEditor placeholder="Start writing..." />;
}
```

## 3) Validate installation

If this renders correctly, installation is valid:

- You can type in the editor
- Toolbar appears
- No module resolution errors in dev server

## Quick validation checklist

- `@lyfie/luthor/styles.css` is imported
- React app builds without peer dependency warnings
- Editor mounts without runtime errors

## Next

- [Luthor Presets](/docs/luthor/presets/)

