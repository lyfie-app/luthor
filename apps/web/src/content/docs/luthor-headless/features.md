---
title: Features
description: Complete out-of-the-box capabilities and extension inventory for @lyfie/luthor-headless.
---

# Features - @lyfie/luthor-headless

This page summarizes what you get out of the box from the headless package.

## Core runtime

- `createEditorSystem`
- `useEditor`
- `RichText` renderer
- typed command/state wiring based on installed extensions

## Text formatting extensions

- `boldExtension`
- `italicExtension`
- `underlineExtension`
- `strikethroughExtension`
- `subscriptExtension`
- `superscriptExtension`
- `codeFormatExtension` (inline code)
- `linkExtension`
- `horizontalRuleExtension`
- `fontFamilyExtension`
- `fontSizeExtension`
- `lineHeightExtension`
- `textColorExtension`
- `textHighlightExtension`
- `blockFormatExtension`
- `listExtension`
- `tableExtension`

## Code and structure extensions

- `codeExtension`
- `codeIntelligenceExtension`
- `historyExtension`
- `tabIndentExtension`
- `enterKeyBehaviorExtension`

## Media extensions

- `imageExtension`
- `iframeEmbedExtension`
- `youTubeEmbedExtension`

## UI and interaction extensions

- `commandPaletteExtension`
- `slashCommandExtension`
- `emojiExtension`
- `floatingToolbarExtension`
- `contextMenuExtension`
- `draggableBlockExtension`

## Custom extension support

- `createCustomNodeExtension`
- base extension contracts and extension categories

## Utilities and types

- theme utilities (`defaultLuthorTheme`, `mergeThemes`, token helpers)
- markdown bridge utilities (`markdownToJSONB`, `jsonbToMarkdown`)
- rich set of exported extension config/types

## Optional ecosystem integrations

- `highlight.js` for richer code token theming
- `@emoji-mart/data` for larger emoji catalog integration

## Notes

`@lyfie/luthor` includes `@lyfie/luthor-headless` and builds preset editors on top of these capabilities.

