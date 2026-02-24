---
title: ExtensiveEditor
description: Usage and full props list for the ExtensiveEditor preset.
---

# ExtensiveEditor

`ExtensiveEditor` is the full-feature preset editor.

## Usage

```tsx
import { ExtensiveEditor } from '@lyfie/luthor';
import '@lyfie/luthor/styles.css';

export function App() {
  return <ExtensiveEditor placeholder="Write anything..." />;
}
```

## Props

`ExtensiveEditorProps` includes:

- `className?`
- `onReady?`
- `initialTheme?`
- `theme?`
- `defaultContent?`
- `showDefaultContent?`
- `placeholder?`
- `initialMode?`
- `availableModes?`
- `variantClassName?`
- `toolbarLayout?`
- `toolbarVisibility?`
- `toolbarPosition?`
- `toolbarAlignment?`
- `toolbarClassName?`
- `toolbarStyleVars?`
- `quoteClassName?`
- `quoteStyleVars?`
- `defaultSettings?`
- `editorThemeOverrides?`
- `isToolbarEnabled?`
- `fontFamilyOptions?`
- `fontSizeOptions?`
- `lineHeightOptions?`
- `minimumDefaultLineHeight?`
- `scaleByRatio?`
- `headingOptions?`
- `paragraphLabel?`
- `syncHeadingOptionsWithCommands?`
- `slashCommandVisibility?`
- `shortcutConfig?`
- `commandPaletteShortcutOnly?`
- `isDraggableBoxEnabled?`
- `featureFlags?`
- `syntaxHighlighting?`
- `codeHighlightProvider?`
- `loadCodeHighlightProvider?`
- `maxAutoDetectCodeLength?`
- `isCopyAllowed?`
- `languageOptions?`

## Ref API

`ExtensiveEditorRef`:

- `injectJSONB(content: string)`
- `getJSONB(): string`

## Notes

This is the base preset that other presets reuse via `ExtensiveEditorProps`.

