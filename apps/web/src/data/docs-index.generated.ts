export const docsIndex = [
  {
    "slug": [],
    "title": "Luthor Documentation",
    "description": "Focused documentation for getting started, luthor-headless features, and luthor presets.",
    "content": "\n# [Luthor](/demo/) Documentation\n\nThis documentation is intentionally focused and grouped into three sections.\n\n## Groups\n\n- [Getting Started](/docs/getting-started/)\n- [Luthor Headless - @lyfie/luthor-headless](/docs/luthor-headless/features/)\n- [Luthor - @lyfie/luthor](/docs/luthor/presets/)\n\n## Recommended Path\n\n1. Read [Introduction](/docs/getting-started/)\n2. Run [Installation](/docs/getting-started/installation/)\n3. Follow one quick start:\n   - [Get Started @lyfie/luthor](/docs/getting-started/luthor/)\n   - [Get Started @lyfie/luthor-headless](/docs/getting-started/luthor-headless/)\n",
    "urlPath": "/docs/",
    "sourcePath": "apps/web/src/content/docs/index.md",
    "updatedAt": "2026-02-24T09:42:01.669Z"
  },
  {
    "slug": [
      "getting-started"
    ],
    "title": "Introduction",
    "description": "What Luthor and Luthor Headless are, and when to use each package.",
    "content": "\n# Introduction\n\n`@lyfie/luthor` and `@lyfie/luthor-headless` solve different needs.\n\n## @lyfie/luthor\n\nUse this when you want a production-ready editor quickly.\n\n- Includes preset editors and prebuilt UI\n- Includes `@lyfie/luthor-headless` under the hood\n- Best for fast shipping with strong defaults\n\n## @lyfie/luthor-headless\n\nUse this when you want full control over UI and behavior.\n\n- Extension-first architecture\n- Bring your own toolbar and app UX\n- Best for custom product-specific editing flows\n\n## Compatibility\n\nBased on package metadata in `packages/luthor/package.json` and `packages/headless/package.json`:\n\n- React: `^18.0.0 || ^19.0.0`\n- React DOM: `^18.0.0 || ^19.0.0`\n- TypeScript/TSX: fully supported (the APIs are TypeScript-first)\n- Lexical:\n  - `@lyfie/luthor`: uses Lexical `^0.40.0` dependencies internally\n  - `@lyfie/luthor-headless`: peer dependency `>=0.40.0` for `lexical` and required `@lexical/*` packages\n\n## Which package should you choose?\n\n- Choose `@lyfie/luthor` if you want speed and ready-made preset UX.\n- Choose `@lyfie/luthor-headless` if you need deep customization and your own UI.\n\n## Next\n\n- [Installation](/docs/getting-started/installation/)\n- [Get Started @lyfie/luthor](/docs/getting-started/luthor/)\n- [Get Started @lyfie/luthor-headless](/docs/getting-started/luthor-headless/)\n",
    "urlPath": "/docs/getting-started/",
    "sourcePath": "apps/web/src/content/docs/getting-started/index.md",
    "updatedAt": "2026-02-24T09:42:10.707Z"
  },
  {
    "slug": [
      "getting-started",
      "installation"
    ],
    "title": "Installation",
    "description": "Install, update, uninstall, and avoid common mistakes for both packages.",
    "content": "\n# Installation\n\nThis page covers install, update, and uninstall for both packages.\n\n## Install @lyfie/luthor\n\n```bash\nnpm install @lyfie/luthor react react-dom\n```\n\n## Install @lyfie/luthor-headless\n\n```bash\nnpm install @lyfie/luthor-headless lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils react react-dom\n```\n\nOptional for headless:\n\n```bash\nnpm install highlight.js\n```\n\n```bash\nnpm install @emoji-mart/data\n```\n\n## Update packages\n\n```bash\nnpm update @lyfie/luthor @lyfie/luthor-headless\n```\n\n## Uninstall packages\n\n```bash\nnpm uninstall @lyfie/luthor @lyfie/luthor-headless\n```\n\nIf you installed headless peers directly and want to remove them too:\n\n```bash\nnpm uninstall lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils highlight.js @emoji-mart/data\n```\n\n## Common mistakes and things to keep in mind\n\n### 1) Missing Lexical peer dependencies (headless only)\n\n`@lyfie/luthor-headless` requires `lexical` + key `@lexical/*` packages. If these are missing, runtime/editor init fails.\n\n### 2) Missing styles with @lyfie/luthor\n\nAlways import preset styles:\n\n```tsx\nimport '@lyfie/luthor/styles.css';\n```\n\n### 3) Version mismatches across React/Lexical\n\nKeep React and Lexical versions compatible with package peer ranges from `package.json`.\n\n### 4) Using preset docs for headless setup (or vice versa)\n\n- `@lyfie/luthor`: preset-first, ready UI\n- `@lyfie/luthor-headless`: extension-first, custom UI\n\n### 5) Optional dependencies confusion\n\n`highlight.js` and `@emoji-mart/data` are optional for headless. The editor still works without them.\n\n## Next\n\n- [Get Started @lyfie/luthor](/docs/getting-started/luthor/)\n- [Get Started @lyfie/luthor-headless](/docs/getting-started/luthor-headless/)\n",
    "urlPath": "/docs/getting-started/installation/",
    "sourcePath": "apps/web/src/content/docs/getting-started/installation.md",
    "updatedAt": "2026-02-24T09:42:26.879Z"
  },
  {
    "slug": [
      "getting-started",
      "luthor-headless"
    ],
    "title": "Get Started @lyfie/luthor-headless",
    "description": "Minimal setup and validation for the headless package.",
    "content": "\n# Get Started @lyfie/luthor-headless\n\nUse this when you need full control over editor UI.\n\n## 1) Install\n\n```bash\nnpm install @lyfie/luthor-headless lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils react react-dom\n```\n\n## 2) Render a minimal headless editor\n\n```tsx\nimport {\n  createEditorSystem,\n  RichText,\n  richTextExtension,\n  boldExtension,\n  italicExtension,\n} from '@lyfie/luthor-headless';\n\nconst extensions = [richTextExtension, boldExtension, italicExtension] as const;\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\n\nfunction Toolbar() {\n  const { commands, activeStates } = useEditor();\n\n  return (\n    <div>\n      <button onClick={() => commands.toggleBold()} aria-pressed={activeStates.bold}>Bold</button>\n      <button onClick={() => commands.toggleItalic()} aria-pressed={activeStates.italic}>Italic</button>\n    </div>\n  );\n}\n\nexport function App() {\n  return (\n    <Provider extensions={extensions}>\n      <Toolbar />\n      <RichText placeholder=\"Write here...\" />\n    </Provider>\n  );\n}\n```\n\n## 3) Validate installation\n\nIf this works, installation is valid:\n\n- Text area mounts\n- Buttons execute bold/italic commands\n- No missing peer dependency errors for Lexical packages\n\n## Quick validation checklist\n\n- All required `lexical` and `@lexical/*` peers are installed\n- `createEditorSystem` provider wraps your editor UI\n- Commands and active states are accessible from `useEditor()`\n\n## Next\n\n- [Headless Features](/docs/luthor-headless/features/)\n\n",
    "urlPath": "/docs/getting-started/luthor-headless/",
    "sourcePath": "apps/web/src/content/docs/getting-started/luthor-headless.md",
    "updatedAt": "2026-02-24T09:42:44.198Z"
  },
  {
    "slug": [
      "getting-started",
      "luthor"
    ],
    "title": "Get Started @lyfie/luthor",
    "description": "Minimal setup and validation for the preset package.",
    "content": "\n# Get Started @lyfie/luthor\n\nUse this when you want a ready-to-use editor quickly.\n\n## 1) Install\n\n```bash\nnpm install @lyfie/luthor react react-dom\n```\n\n## 2) Render a basic editor\n\n```tsx\nimport { ExtensiveEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <ExtensiveEditor placeholder=\"Start writing...\" />;\n}\n```\n\n## 3) Validate installation\n\nIf this renders correctly, installation is valid:\n\n- You can type in the editor\n- Toolbar appears\n- No module resolution errors in dev server\n\n## Quick validation checklist\n\n- `@lyfie/luthor/styles.css` is imported\n- React app builds without peer dependency warnings\n- Editor mounts without runtime errors\n\n## Next\n\n- [Luthor Presets](/docs/luthor/presets/)\n\n",
    "urlPath": "/docs/getting-started/luthor/",
    "sourcePath": "apps/web/src/content/docs/getting-started/luthor.md",
    "updatedAt": "2026-02-24T09:42:33.384Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features"
    ],
    "title": "Features",
    "description": "Complete out-of-the-box capabilities and extension inventory for @lyfie/luthor-headless.",
    "content": "\n# Features - @lyfie/luthor-headless\n\nThis page summarizes what you get out of the box from the headless package.\n\n## Core runtime\n\n- `createEditorSystem`\n- `useEditor`\n- `RichText` renderer\n- typed command/state wiring based on installed extensions\n\n## Text formatting extensions\n\n- `boldExtension`\n- `italicExtension`\n- `underlineExtension`\n- `strikethroughExtension`\n- `subscriptExtension`\n- `superscriptExtension`\n- `codeFormatExtension` (inline code)\n- `linkExtension`\n- `horizontalRuleExtension`\n- `fontFamilyExtension`\n- `fontSizeExtension`\n- `lineHeightExtension`\n- `textColorExtension`\n- `textHighlightExtension`\n- `blockFormatExtension`\n- `listExtension`\n- `tableExtension`\n\n## Code and structure extensions\n\n- `codeExtension`\n- `codeIntelligenceExtension`\n- `historyExtension`\n- `tabIndentExtension`\n- `enterKeyBehaviorExtension`\n\n## Media extensions\n\n- `imageExtension`\n- `iframeEmbedExtension`\n- `youTubeEmbedExtension`\n\n## UI and interaction extensions\n\n- `commandPaletteExtension`\n- `slashCommandExtension`\n- `emojiExtension`\n- `floatingToolbarExtension`\n- `contextMenuExtension`\n- `draggableBlockExtension`\n\n## Custom extension support\n\n- `createCustomNodeExtension`\n- base extension contracts and extension categories\n\n## Utilities and types\n\n- theme utilities (`defaultLuthorTheme`, `mergeThemes`, token helpers)\n- markdown bridge utilities (`markdownToJSONB`, `jsonbToMarkdown`)\n- rich set of exported extension config/types\n\n## Optional ecosystem integrations\n\n- `highlight.js` for richer code token theming\n- `@emoji-mart/data` for larger emoji catalog integration\n\n## Notes\n\n`@lyfie/luthor` includes `@lyfie/luthor-headless` and builds preset editors on top of these capabilities.\n\n",
    "urlPath": "/docs/luthor-headless/features/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features.md",
    "updatedAt": "2026-02-24T09:42:53.791Z"
  },
  {
    "slug": [
      "luthor",
      "presets"
    ],
    "title": "Presets",
    "description": "Preset catalog for @lyfie/luthor, including links to per-preset docs.",
    "content": "\n# Presets - @lyfie/luthor\n\n`@lyfie/luthor` is a preset package built on top of `@lyfie/luthor-headless`.\n\n## Important\n\n`@lyfie/luthor-headless` is included with `@lyfie/luthor` and available via:\n\n```ts\nimport { headless } from '@lyfie/luthor';\n```\n\n## Presets included\n\n- `ExtensiveEditor`\n- `SimpleTextEditor`\n- `RichTextBoxEditor`\n- `ChatWindowEditor`\n- `EmailComposeEditor`\n- `MDTextEditor`\n- `NotionLikeEditor`\n- `HeadlessEditorPreset`\n- `NotesEditor`\n\n## Per-preset docs\n\n- [ExtensiveEditor](/docs/luthor/presets/extensive-editor/)\n- [SimpleTextEditor](/docs/luthor/presets/simple-text-editor/)\n- [RichTextBoxEditor](/docs/luthor/presets/rich-text-box-editor/)\n- [ChatWindowEditor](/docs/luthor/presets/chat-window-editor/)\n- [EmailComposeEditor](/docs/luthor/presets/email-compose-editor/)\n- [MDTextEditor](/docs/luthor/presets/md-text-editor/)\n- [NotionLikeEditor](/docs/luthor/presets/notion-like-editor/)\n- [HeadlessEditorPreset](/docs/luthor/presets/headless-editor-preset/)\n- [NotesEditor](/docs/luthor/presets/notes-editor/)\n\n",
    "urlPath": "/docs/luthor/presets/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets.md",
    "updatedAt": "2026-02-24T09:43:04.227Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "chat-window-editor"
    ],
    "title": "ChatWindowEditor",
    "description": "Usage and props for the ChatWindowEditor preset.",
    "content": "\n# ChatWindowEditor\n\nChat composer style preset with send/action controls.\n\n## Usage\n\n```tsx\nimport { ChatWindowEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return (\n    <ChatWindowEditor\n      onSend={({ jsonb }) => console.log(jsonb)}\n      submitOnEnter\n      allowShiftEnter\n    />\n  );\n}\n```\n\n## Props\n\n`ChatWindowEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `featureFlags`, `isToolbarEnabled`\n- Adds:\n  - `onSend?: (payload: { jsonb: string }) => void`\n  - `submitOnEnter?: boolean`\n  - `allowShiftEnter?: boolean`\n  - `showVoiceButton?: boolean`\n  - `showImageButton?: boolean`\n  - `showSendButton?: boolean`\n\n## Behavior\n\n- Toolbar is disabled by preset defaults\n- Visual mode only\n- Enter-to-send can be configured\n\n",
    "urlPath": "/docs/luthor/presets/chat-window-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/chat-window-editor.md",
    "updatedAt": "2026-02-24T09:43:36.220Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "email-compose-editor"
    ],
    "title": "EmailComposeEditor",
    "description": "Usage and props for the EmailComposeEditor preset.",
    "content": "\n# EmailComposeEditor\n\nEmail composer preset with To/Cc/Bcc/Subject shell.\n\n## Usage\n\n```tsx\nimport { EmailComposeEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <EmailComposeEditor showCc showBcc />;\n}\n```\n\n## Props\n\n`EmailComposeEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `featureFlags`\n- Adds:\n  - `showTo?: boolean`\n  - `showCc?: boolean`\n  - `showBcc?: boolean`\n  - `showSubject?: boolean`\n\n## Behavior\n\nPreset applies email-friendly feature defaults and renders compose header fields.\n\n",
    "urlPath": "/docs/luthor/presets/email-compose-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/email-compose-editor.md",
    "updatedAt": "2026-02-24T09:43:42.808Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "extensive-editor"
    ],
    "title": "ExtensiveEditor",
    "description": "Usage and full props list for the ExtensiveEditor preset.",
    "content": "\n# ExtensiveEditor\n\n`ExtensiveEditor` is the full-feature preset editor.\n\n## Usage\n\n```tsx\nimport { ExtensiveEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <ExtensiveEditor placeholder=\"Write anything...\" />;\n}\n```\n\n## Props\n\n`ExtensiveEditorProps` includes:\n\n- `className?`\n- `onReady?`\n- `initialTheme?`\n- `theme?`\n- `defaultContent?`\n- `showDefaultContent?`\n- `placeholder?`\n- `initialMode?`\n- `availableModes?`\n- `variantClassName?`\n- `toolbarLayout?`\n- `toolbarVisibility?`\n- `toolbarPosition?`\n- `toolbarAlignment?`\n- `toolbarClassName?`\n- `toolbarStyleVars?`\n- `quoteClassName?`\n- `quoteStyleVars?`\n- `defaultSettings?`\n- `editorThemeOverrides?`\n- `isToolbarEnabled?`\n- `fontFamilyOptions?`\n- `fontSizeOptions?`\n- `lineHeightOptions?`\n- `minimumDefaultLineHeight?`\n- `scaleByRatio?`\n- `headingOptions?`\n- `paragraphLabel?`\n- `syncHeadingOptionsWithCommands?`\n- `slashCommandVisibility?`\n- `shortcutConfig?`\n- `commandPaletteShortcutOnly?`\n- `isDraggableBoxEnabled?`\n- `featureFlags?`\n- `syntaxHighlighting?`\n- `codeHighlightProvider?`\n- `loadCodeHighlightProvider?`\n- `maxAutoDetectCodeLength?`\n- `isCopyAllowed?`\n- `languageOptions?`\n\n## Ref API\n\n`ExtensiveEditorRef`:\n\n- `injectJSONB(content: string)`\n- `getJSONB(): string`\n\n## Notes\n\nThis is the base preset that other presets reuse via `ExtensiveEditorProps`.\n\n",
    "urlPath": "/docs/luthor/presets/extensive-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/extensive-editor.md",
    "updatedAt": "2026-02-24T09:43:13.513Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "headless-editor-preset"
    ],
    "title": "HeadlessEditorPreset",
    "description": "Usage and props for the HeadlessEditorPreset preset.",
    "content": "\n# HeadlessEditorPreset\n\nSmall reference preset demonstrating direct headless composition.\n\n## Usage\n\n```tsx\nimport { HeadlessEditorPreset } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <HeadlessEditorPreset placeholder=\"Start writing...\" />;\n}\n```\n\n## Props\n\n`HeadlessEditorPresetProps`:\n\n- `className?: string`\n- `placeholder?: string`\n\n## Behavior\n\nUses a minimal extension set (`richText`, `history`, `bold`, `italic`, `underline`, `list`) and a lightweight toolbar.\n\n",
    "urlPath": "/docs/luthor/presets/headless-editor-preset/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/headless-editor-preset.md",
    "updatedAt": "2026-02-24T09:44:18.417Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "md-text-editor"
    ],
    "title": "MDTextEditor",
    "description": "Usage and props for the MDTextEditor preset.",
    "content": "\n# MDTextEditor\n\nPreset that switches between Visual and Markdown editing.\n\n## Usage\n\n```tsx\nimport { MDTextEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <MDTextEditor initialMode=\"visual\" />;\n}\n```\n\n## Props\n\n`MDTextEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `availableModes`, `initialMode`\n- Adds:\n  - `initialMode?: 'visual' | 'markdown'`\n\n## Behavior\n\n- Uses markdown/jsonb bridge for mode conversion\n- Applies feature defaults suitable for markdown workflows\n\n",
    "urlPath": "/docs/luthor/presets/md-text-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/md-text-editor.md",
    "updatedAt": "2026-02-24T09:44:00.380Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "notes-editor"
    ],
    "title": "NotesEditor",
    "description": "Usage and props for the NotesEditor preset.",
    "content": "\n# NotesEditor\n\nNotes-style preset with title and action controls.\n\n## Usage\n\n```tsx\nimport { NotesEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return (\n    <NotesEditor\n      showTitle\n      title=\"Sprint Notes\"\n      onTitleChange={(value) => console.log(value)}\n      onPin={() => console.log('pin')}\n      onArchive={() => console.log('archive')}\n    />\n  );\n}\n```\n\n## Props\n\n`NotesEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `featureFlags`\n- Adds:\n  - `showTitle?: boolean`\n  - `title?: string`\n  - `onTitleChange?: (value: string) => void`\n  - `showActions?: boolean`\n  - `onPin?: () => void`\n  - `onArchive?: () => void`\n  - `onColorChange?: (color: string) => void`\n  - `colorOptions?: readonly string[]`\n\n## Behavior\n\nToolbar is disabled by preset default and feature set is tuned for lightweight note taking.\n\n",
    "urlPath": "/docs/luthor/presets/notes-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/notes-editor.md",
    "updatedAt": "2026-02-24T09:44:28.234Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "notion-like-editor"
    ],
    "title": "NotionLikeEditor",
    "description": "Usage and props for the NotionLikeEditor preset.",
    "content": "\n# NotionLikeEditor\n\nSlash-first preset with draggable-focused defaults.\n\n## Usage\n\n```tsx\nimport { NotionLikeEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <NotionLikeEditor isDraggableEnabled slashVisibility={{ allowlist: ['block.paragraph'] }} />;\n}\n```\n\n## Props\n\n`NotionLikeEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `featureFlags`, `isToolbarEnabled`\n- Adds:\n  - `slashVisibility?: SlashCommandVisibility`\n  - `isDraggableEnabled?: boolean`\n  - `featureFlags?: FeatureFlagOverrides`\n  - `isToolbarEnabled?: boolean`\n\n## Behavior\n\nDefaults enable slash commands + draggable blocks + command palette with toolbar hidden by default.\n\n",
    "urlPath": "/docs/luthor/presets/notion-like-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/notion-like-editor.md",
    "updatedAt": "2026-02-24T09:44:07.513Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "rich-text-box-editor"
    ],
    "title": "RichTextBoxEditor",
    "description": "Usage and props for the RichTextBoxEditor preset.",
    "content": "\n# RichTextBoxEditor\n\nCompact rich-text preset for focused editing.\n\n## Usage\n\n```tsx\nimport { RichTextBoxEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <RichTextBoxEditor compactToolbar />;\n}\n```\n\n## Props\n\n`RichTextBoxEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `featureFlags`\n- Adds:\n  - `featureFlags?: FeatureFlagOverrides`\n  - `compactToolbar?: boolean`\n\n## Behavior\n\nDefault feature flags enable core text formatting and disable heavier media/embed features unless re-enabled.\n\n",
    "urlPath": "/docs/luthor/presets/rich-text-box-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/rich-text-box-editor.md",
    "updatedAt": "2026-02-24T09:43:29.129Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "simple-text-editor"
    ],
    "title": "SimpleTextEditor",
    "description": "Usage and props for the SimpleTextEditor preset.",
    "content": "\n# SimpleTextEditor\n\nMinimal/plain-text style preset built on top of `ExtensiveEditor`.\n\n## Usage\n\n```tsx\nimport { SimpleTextEditor } from '@lyfie/luthor';\nimport '@lyfie/luthor/styles.css';\n\nexport function App() {\n  return <SimpleTextEditor placeholder=\"Start writing...\" />;\n}\n```\n\n## Props\n\n`SimpleTextEditorProps`:\n\n- Inherits `ExtensiveEditorProps`\n- Excludes: `featureFlags`, `availableModes`, `initialMode`, `toolbarVisibility`\n- Adds:\n  - `hideToolbarByDefault?: boolean` (default `true`)\n\n## Behavior\n\n- Forces visual-only mode\n- Disables most rich features by preset defaults\n\n",
    "urlPath": "/docs/luthor/presets/simple-text-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/simple-text-editor.md",
    "updatedAt": "2026-02-24T09:43:22.221Z"
  }
];
