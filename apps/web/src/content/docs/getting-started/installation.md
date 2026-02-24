---
title: Installation
description: Install, update, uninstall, and avoid common mistakes for both packages.
---

# Installation

This page covers install, update, and uninstall for both packages.

## Install @lyfie/luthor

```bash
npm install @lyfie/luthor react react-dom
```

## Install @lyfie/luthor-headless

```bash
npm install @lyfie/luthor-headless lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils react react-dom
```

Optional for headless:

```bash
npm install highlight.js
```

```bash
npm install @emoji-mart/data
```

## Update packages

```bash
npm update @lyfie/luthor @lyfie/luthor-headless
```

## Uninstall packages

```bash
npm uninstall @lyfie/luthor @lyfie/luthor-headless
```

If you installed headless peers directly and want to remove them too:

```bash
npm uninstall lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils highlight.js @emoji-mart/data
```

## Common mistakes and things to keep in mind

### 1) Missing Lexical peer dependencies (headless only)

`@lyfie/luthor-headless` requires `lexical` + key `@lexical/*` packages. If these are missing, runtime/editor init fails.

### 2) Missing styles with @lyfie/luthor

Always import preset styles:

```tsx
import '@lyfie/luthor/styles.css';
```

### 3) Version mismatches across React/Lexical

Keep React and Lexical versions compatible with package peer ranges from `package.json`.

### 4) Using preset docs for headless setup (or vice versa)

- `@lyfie/luthor`: preset-first, ready UI
- `@lyfie/luthor-headless`: extension-first, custom UI

### 5) Optional dependencies confusion

`highlight.js` and `@emoji-mart/data` are optional for headless. The editor still works without them.

## Next

- [Get Started @lyfie/luthor](/docs/getting-started/luthor/)
- [Get Started @lyfie/luthor-headless](/docs/getting-started/luthor-headless/)
