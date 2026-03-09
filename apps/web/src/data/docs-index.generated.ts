export const docsIndex = [
  {
    "slug": [
      "getting-started"
    ],
    "title": "Introduction",
    "description": "What @lyfie/luthor and @lyfie/luthor-headless are, and when to use each package.",
    "content": "\r\n# Introduction\r\n\r\n`@lyfie/luthor` and `@lyfie/luthor-headless` solve different needs.\r\n\r\n## @lyfie/luthor\r\n\r\nUse this when you want a production-ready editor quickly.\r\n\r\n- Includes preset editors and prebuilt UI\r\n- Includes `@lyfie/luthor-headless` under the hood\r\n- Best for fast shipping with strong defaults\r\n\r\n## @lyfie/luthor-headless\r\n\r\nUse this when you want full control over UI and behavior.\r\n\r\n- Extension-first architecture\r\n- Bring your own toolbar and app UX\r\n- Best for custom product-specific editing flows\r\n\r\n## Compatibility\r\n\r\nBased on package metadata in `packages/luthor/package.json` and `packages/headless/package.json`:\r\n\r\n- React: `^18.0.0 || ^19.0.0`\r\n- React DOM: `^18.0.0 || ^19.0.0`\r\n- TypeScript/TSX: fully supported\r\n- Lexical:\r\n  - `@lyfie/luthor`: uses Lexical `^0.40.0` dependencies internally\r\n  - `@lyfie/luthor-headless`: peer dependency `>=0.40.0` for `lexical` and required `@lexical/*` packages\r\n\r\n## Recommended path\r\n\r\n1. [Introduction](/docs/getting-started/)\r\n2. [Installation](/docs/getting-started/installation/)\r\n3. [Capabilities](/docs/getting-started/capabilities/)\r\n4. [@lyfie/luthor-headless](/docs/getting-started/luthor-headless/)\r\n5. [@lyfie/luthor](/docs/getting-started/luthor/)\r\n",
    "urlPath": "/docs/getting-started/",
    "sourcePath": "apps/web/src/content/docs/getting-started/index.md",
    "updatedAt": "2026-03-09T17:20:54.174Z"
  },
  {
    "slug": [
      "getting-started",
      "capabilities"
    ],
    "title": "Capabilities",
    "description": "Complete capability overview copied from the home page Why [Luthor](/demo/) section, with package availability notes.",
    "content": "\r\n# Capabilities\r\nFor Lexical engine-level behavior and APIs, read the official Lexical docs: [lexical.dev/docs](https://lexical.dev/docs/intro).\r\n\r\n## Typography Controls\r\n\r\n![Typography controls preview](/features/Feature1.gif)\r\n\r\nCustom fonts, font size controls, and line-height that behaves. Typography should fit your product voice, not force browser defaults.\r\n\r\n- Use any custom font you want.\r\n- Dial in font sizes for readability.\r\n- Granular line-height control for cleaner rhythm.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Essentials Done Right\r\n\r\n![Text formatting essentials preview](/features/Feature2.gif)\r\n\r\nBold, italic, underline, strike, sub/superscript, code, and quotes. Core formatting is implemented cleanly and type-safe.\r\n\r\n- Bold, italic, underline, and strikethrough.\r\n- Subscript and superscript support.\r\n- Inline code and block quotes.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Color And Highlight\r\n\r\n![Color and highlight preview](/features/Feature3.gif)\r\n\r\nApply font color and highlights without inline style chaos. Color tools integrate with themes and keep output clean.\r\n\r\n- Font color support.\r\n- Highlight support.\r\n- Theme-friendly output styles.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Links And Structure\r\n\r\n![Links and structure preview](/features/Feature4.gif)\r\n\r\nPredictable links plus semantic headings and paragraph flow. Link insertion is clean, and document hierarchy stays sane.\r\n\r\n- Predictable link insertion behavior.\r\n- Paragraphs and headings from H1 to H6.\r\n- Left, center, right, and justify alignment.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Lists That Know What They're Doing\r\n\r\n![Lists preview](/features/Feature5.gif)\r\n\r\nUnordered, ordered, and checklist/task lists in one workflow. Use the right list type without fighting editor state.\r\n\r\n- Unordered lists for free-form notes.\r\n- Ordered lists for sequences and steps.\r\n- Checklist/task lists for actionable content.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Indentation Control\r\n\r\n![Indentation preview](/social-card.svg)\r\n\r\nIndent in and out with consistent, structure-safe behavior. Tab behavior is predictable and respects document structure.\r\n\r\n- Tab in and tab out quickly.\r\n- Supports structured indentation behavior.\r\n- Works cleanly with nested content.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Rich Embeds\r\n\r\n![Rich embed preview](/social-card.svg)\r\n\r\nEmbed images, iframes, and YouTube content with minimal friction. Paste and render rich media without bolt-on hacks.\r\n\r\n- Image embedding support.\r\n- Iframe embedding support.\r\n- YouTube embed flow.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Code Blocks\r\n\r\n![Code block preview](/features/Feature8.gif)\r\n\r\nSyntax-ready code blocks for docs, tutorials, and snippets. Code content stays structured and extendable for real product usage.\r\n\r\n- Dedicated code block support.\r\n- Built for developer-focused content.\r\n- Extensible for richer syntax experiences.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Dark/Light Ready\r\n\r\n![Theme switching preview](/features/Feature9.gif)\r\n\r\nEditor-layer theme support, not fragile visual hacks. Dark and light mode behavior is built in from the editor layer.\r\n\r\n- Theme switching support.\r\n- Consistent readability across themes.\r\n- Works with your app-level styling model.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## History + Shortcuts\r\n\r\n![Undo, redo, and shortcuts preview](/features/Feature10.gif)\r\n\r\nUndo/redo and keyboard-first interactions across core features. Move fast without relying on toolbar clicks.\r\n\r\n- Full undo and redo history.\r\n- Keyboard-friendly command flow.\r\n- Built for power-user editing speed.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Slash Command Center\r\n\r\n![Slash command preview](/features/Feature11.gif)\r\n\r\nType `/` to discover and trigger editor actions quickly. Slash commands are fast, predictable, and easy to extend.\r\n\r\n- Type `/` to reveal actions.\r\n- Predictable command discovery.\r\n- Extensible command architecture.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n\r\n## Custom Blocks\r\n\r\n![Custom block preview](/features/Feature12.gif)\r\n\r\nCreate custom nodes and schema extensions for product-specific UX. If defaults are not enough, the editor can be shaped around your needs.\r\n\r\n- Create custom nodes.\r\n- Inject product-specific blocks.\r\n- Extend schema behavior safely.\r\n\r\n| Package | Availability |\r\n| --- | --- |\r\n| `@lyfie/luthor` | Yes |\r\n| `@lyfie/luthor-headless` | Yes |\r\n",
    "urlPath": "/docs/getting-started/capabilities/",
    "sourcePath": "apps/web/src/content/docs/getting-started/capabilities.md",
    "updatedAt": "2026-03-09T17:20:54.174Z"
  },
  {
    "slug": [
      "getting-started",
      "installation"
    ],
    "title": "Installation",
    "description": "Install, update, and uninstall @lyfie/luthor and @lyfie/luthor-headless.",
    "content": "\r\n# Installation\r\n\r\nThis page covers install, update, and uninstall for both packages.\r\n\r\n## Install @lyfie/luthor\r\n\r\n```bash\r\nnpm install @lyfie/luthor react react-dom\r\n```\r\n\r\n## Install @lyfie/luthor-headless\r\n\r\n```bash\r\nnpm install @lyfie/luthor-headless lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils react react-dom\r\n```\r\n\r\nOptional for headless:\r\n\r\n```bash\r\nnpm install highlight.js @emoji-mart/data\r\n```\r\n\r\n## Update packages\r\n\r\n```bash\r\nnpm update @lyfie/luthor @lyfie/luthor-headless\r\n```\r\n\r\n## Uninstall packages\r\n\r\n```bash\r\nnpm uninstall @lyfie/luthor @lyfie/luthor-headless\r\n```\r\n\r\nIf you installed headless peers directly and want to remove them too:\r\n\r\n```bash\r\nnpm uninstall lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils highlight.js @emoji-mart/data\r\n```\r\n\r\n## Common mistakes\r\n\r\n1. Missing Lexical peer dependencies for headless setup\r\n2. Missing `@lyfie/luthor/styles.css` import for presets\r\n3. React/Lexical version mismatch\r\n4. Following preset docs when implementing headless UI (or vice versa)\r\n",
    "urlPath": "/docs/getting-started/installation/",
    "sourcePath": "apps/web/src/content/docs/getting-started/installation.md",
    "updatedAt": "2026-02-24T19:18:59.745Z"
  },
  {
    "slug": [
      "getting-started",
      "luthor-headless"
    ],
    "title": "@lyfie/luthor-headless",
    "description": "Minimal setup and validation for @lyfie/luthor-headless.",
    "content": "\r\n# @lyfie/luthor-headless\r\n\r\nUse this when you need full control over editor UI.\r\n\r\n## Install\r\n\r\n```bash\r\nnpm install @lyfie/luthor-headless lexical @lexical/code @lexical/link @lexical/list @lexical/markdown @lexical/react @lexical/rich-text @lexical/selection @lexical/table @lexical/utils react react-dom\r\n```\r\n\r\n## Render a minimal headless editor\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  boldExtension,\r\n  italicExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [richTextExtension, boldExtension, italicExtension] as const;\r\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\r\n\r\nfunction Toolbar() {\r\n  const { commands, activeStates } = useEditor();\r\n\r\n  return (\r\n    <div>\r\n      <button onClick={() => commands.toggleBold?.()} aria-pressed={activeStates.bold === true}>Bold</button>\r\n      <button onClick={() => commands.toggleItalic?.()} aria-pressed={activeStates.italic === true}>Italic</button>\r\n    </div>\r\n  );\r\n}\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <Toolbar />\r\n      <RichText placeholder=\"Write here...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n\r\n## Validate installation\r\n\r\n- Text area mounts\r\n- Buttons execute bold and italic commands\r\n- No missing peer dependency errors for Lexical packages\r\n\r\n## Learn more about Lexical\r\n\r\n`@lyfie/luthor-headless` is built on top of Lexical. For deeper engine capabilities and low-level APIs, use the official Lexical documentation: [lexical.dev/docs](https://lexical.dev/docs/intro).\r\n",
    "urlPath": "/docs/getting-started/luthor-headless/",
    "sourcePath": "apps/web/src/content/docs/getting-started/luthor-headless.md",
    "updatedAt": "2026-03-09T17:20:54.179Z"
  },
  {
    "slug": [
      "getting-started",
      "luthor"
    ],
    "title": "@lyfie/luthor",
    "description": "Minimal setup and validation for the preset package.",
    "content": "\r\n# @lyfie/luthor\r\n\r\nUse this when you want a ready-to-use editor quickly.\r\n\r\n## Install\r\n\r\n```bash\r\nnpm install @lyfie/luthor react react-dom\r\n```\r\n\r\n## Render a basic editor\r\n\r\n```tsx\r\nimport { ExtensiveEditor } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return <ExtensiveEditor placeholder=\"Start writing...\" />;\r\n}\r\n```\r\n\r\n## Validate installation\r\n\r\n- You can type in the editor\r\n- Toolbar appears\r\n- No module resolution errors in the dev server\r\n",
    "urlPath": "/docs/getting-started/luthor/",
    "sourcePath": "apps/web/src/content/docs/getting-started/luthor.md",
    "updatedAt": "2026-02-24T19:18:59.746Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features"
    ],
    "title": "Features",
    "description": "Grouped feature documentation for @lyfie/luthor-headless.",
    "content": "\r\n# Features\r\n\r\nFeature docs are grouped to match the home page feature set.\r\n\r\n## Feature groups\r\n\r\n- [Typography and Text](/docs/luthor-headless/features/typography-and-text/)\r\n- [Structure and Lists](/docs/luthor-headless/features/structure-and-lists/)\r\n- [Media and Embeds](/docs/luthor-headless/features/media-and-embeds/)\r\n- [Code and Devtools](/docs/luthor-headless/features/code-and-devtools/)\r\n- [Interaction and Productivity](/docs/luthor-headless/features/interaction-and-productivity/)\r\n- [Customization and Theming](/docs/luthor-headless/features/customization-and-theming/)\r\n\r\nFor deeper engine-level capability details, see the official Lexical docs: [lexical.dev/docs](https://lexical.dev/docs/intro).\r\n\r\n## Base runtime\r\n\r\n```tsx\r\nimport { createEditorSystem, RichText, richTextExtension } from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [richTextExtension] as const;\r\nconst { Provider } = createEditorSystem<typeof extensions>();\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <RichText placeholder=\"Write here...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n",
    "urlPath": "/docs/luthor-headless/features/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features.md",
    "updatedAt": "2026-03-09T17:20:54.179Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features",
      "code-and-devtools"
    ],
    "title": "Code and Devtools",
    "description": "Code blocks, syntax support, and markdown/json conversion tools.",
    "content": "\r\n# Code and Devtools\r\n\r\nThis group covers code editing and developer-facing utilities.\r\n\r\n## Included extensions and utilities\r\n\r\n- `codeExtension`\r\n- `codeIntelligenceExtension`\r\n- `codeFormatExtension`\r\n- `markdownToJSON`, `jsonToMarkdown`\r\n\r\n## Example: code editor setup\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  codeExtension,\r\n  codeIntelligenceExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [richTextExtension, codeExtension, codeIntelligenceExtension] as const;\r\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\r\n\r\nfunction Toolbar() {\r\n  const { commands } = useEditor();\r\n  return <button onClick={() => commands.insertCodeBlock?.({ language: 'ts' })}>Code Block</button>;\r\n}\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <Toolbar />\r\n      <RichText placeholder=\"Write docs with code...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n\r\n## Example: markdown bridge\r\n\r\n```ts\r\nimport { markdownToJSON, jsonToMarkdown } from '@lyfie/luthor-headless';\r\n\r\nconst json = markdownToJSON('# Title\\n\\nSome text');\r\nconst markdown = jsonToMarkdown(json);\r\n```\r\n",
    "urlPath": "/docs/luthor-headless/features/code-and-devtools/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features/code-and-devtools.md",
    "updatedAt": "2026-02-24T19:18:59.747Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features",
      "customization-and-theming"
    ],
    "title": "Customization and Theming",
    "description": "Custom nodes, theme tokens, and extension-level customization.",
    "content": "\r\n# Customization and Theming\r\n\r\nThis group covers custom block logic and theming APIs.\r\n\r\n## Included APIs\r\n\r\n- `createCustomNodeExtension`\r\n- `defaultLuthorTheme`\r\n- `mergeThemes`\r\n- `createEditorThemeStyleVars`\r\n\r\n## Example: custom extension\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  createCustomNodeExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst calloutExtension = createCustomNodeExtension({\r\n  key: 'callout',\r\n  category: 'block',\r\n  nodeType: 'element',\r\n  createNode: ({ $createParagraphNode, $createTextNode }) => {\r\n    const node = $createParagraphNode();\r\n    node.append($createTextNode('Callout block'));\r\n    return node;\r\n  },\r\n});\r\n\r\nconst extensions = [richTextExtension, calloutExtension] as const;\r\nconst { Provider } = createEditorSystem<typeof extensions>();\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <RichText placeholder=\"Custom editor...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n\r\n## Example: theme override\r\n\r\n```ts\r\nimport { mergeThemes, defaultLuthorTheme } from '@lyfie/luthor-headless';\r\n\r\nconst theme = mergeThemes(defaultLuthorTheme, {\r\n  colors: {\r\n    background: '#0b1020',\r\n    foreground: '#f8fafc',\r\n  },\r\n});\r\n```\r\n",
    "urlPath": "/docs/luthor-headless/features/customization-and-theming/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features/customization-and-theming.md",
    "updatedAt": "2026-02-24T19:18:59.747Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features",
      "interaction-and-productivity"
    ],
    "title": "Interaction and Productivity",
    "description": "Slash commands, command palette, shortcuts, history, and contextual UI.",
    "content": "\r\n# Interaction and Productivity\r\n\r\nThis group covers keyboard-first and contextual workflows.\r\n\r\n## Included extensions\r\n\r\n- `historyExtension`\r\n- `enterKeyBehaviorExtension`\r\n- `commandPaletteExtension`\r\n- `slashCommandExtension`\r\n- `floatingToolbarExtension`\r\n- `contextMenuExtension`\r\n- `emojiExtension`\r\n- `draggableBlockExtension`\r\n\r\n## Example\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  historyExtension,\r\n  commandPaletteExtension,\r\n  slashCommandExtension,\r\n  draggableBlockExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [\r\n  richTextExtension,\r\n  historyExtension,\r\n  commandPaletteExtension,\r\n  slashCommandExtension,\r\n  draggableBlockExtension,\r\n] as const;\r\n\r\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\r\n\r\nfunction Toolbar() {\r\n  const { commands } = useEditor();\r\n  return (\r\n    <div>\r\n      <button onClick={() => commands.undo?.()}>Undo</button>\r\n      <button onClick={() => commands.redo?.()}>Redo</button>\r\n      <button onClick={() => commands.showCommandPalette?.()}>Palette</button>\r\n    </div>\r\n  );\r\n}\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <Toolbar />\r\n      <RichText placeholder=\"Type '/' for commands...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n",
    "urlPath": "/docs/luthor-headless/features/interaction-and-productivity/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features/interaction-and-productivity.md",
    "updatedAt": "2026-02-24T19:18:59.748Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features",
      "media-and-embeds"
    ],
    "title": "Media and Embeds",
    "description": "Image, iframe, and YouTube embedding features.",
    "content": "\r\n# Media and Embeds\r\n\r\nThis group covers rich media insertion.\r\n\r\n## Included extensions\r\n\r\n- `imageExtension`\r\n- `iframeEmbedExtension`\r\n- `youTubeEmbedExtension`\r\n\r\n## Example\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  imageExtension,\r\n  iframeEmbedExtension,\r\n  youTubeEmbedExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [\r\n  richTextExtension,\r\n  imageExtension,\r\n  iframeEmbedExtension,\r\n  youTubeEmbedExtension,\r\n] as const;\r\n\r\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\r\n\r\nfunction Toolbar() {\r\n  const { commands } = useEditor();\r\n  return (\r\n    <div>\r\n      <button onClick={() => commands.insertImage?.({ src: '/demo/image.png', alt: 'Demo' })}>Image</button>\r\n      <button onClick={() => commands.insertIframe?.({ src: 'https://example.com' })}>Iframe</button>\r\n      <button onClick={() => commands.insertYouTube?.('dQw4w9WgXcQ')}>YouTube</button>\r\n    </div>\r\n  );\r\n}\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <Toolbar />\r\n      <RichText placeholder=\"Add media...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n",
    "urlPath": "/docs/luthor-headless/features/media-and-embeds/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features/media-and-embeds.md",
    "updatedAt": "2026-02-24T19:18:59.748Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features",
      "structure-and-lists"
    ],
    "title": "Structure and Lists",
    "description": "Headings, links, lists, tables, and document structure tools.",
    "content": "\r\n# Structure and Lists\r\n\r\nThis group covers links, headings, paragraphs, lists, and table workflows.\r\n\r\n## Included extensions\r\n\r\n- `linkExtension`\r\n- `blockFormatExtension`\r\n- `listExtension`\r\n- `tableExtension`\r\n- `horizontalRuleExtension`\r\n- `tabIndentExtension`\r\n\r\n## List depth and marker patterns\r\n\r\n- List indentation is capped at `8` sub-indent levels (`9` total levels including top-level).\r\n- `ListExtension` supports `maxDepth` configuration for custom depth caps.\r\n- `TabIndentExtension` supports `maxListDepth` so `Tab`/`Shift+Tab` behavior can match list depth limits.\r\n- Depth caps apply uniformly to ordered lists, unordered lists, and checklists.\r\n- `listExtension` supports ordered and unordered marker patterns through:\r\n  - `commands.setOrderedListPattern(pattern)`\r\n  - `commands.setUnorderedListPattern(pattern)`\r\n  - `commands.setOrderedListSuffix('dot' | 'paren')`\r\n- Supported unordered patterns:\r\n  - `disc-circle-square`\r\n  - `arrow-diamond-disc`\r\n  - `square-square-square`\r\n  - `arrow-circle-square`\r\n- Checklist variants are available through:\r\n  - `commands.setCheckListVariant('strikethrough' | 'plain')`\r\n  - `strikethrough`: checked items render with line-through text.\r\n  - `plain`: checked items keep normal text without line-through.\r\n- Checklist variant and unordered marker pattern tokens are stored on list/list-item styles, so imported JSON can be rehydrated with `commands.rehydrateListStyles()`.\r\n\r\n### Depth configuration example\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  ListExtension,\r\n  TabIndentExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst MAX_SUB_INDENT = 5;\r\nconst maxDepth = MAX_SUB_INDENT + 1; // include top-level\r\n\r\nconst extensions = [\r\n  new ListExtension({ maxDepth }),\r\n  new TabIndentExtension({ maxListDepth: maxDepth }),\r\n] as const;\r\n\r\nconst { Provider } = createEditorSystem<typeof extensions>();\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <RichText placeholder=\"Write...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n\r\n## Example\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  linkExtension,\r\n  blockFormatExtension,\r\n  listExtension,\r\n  tableExtension,\r\n  horizontalRuleExtension,\r\n  tabIndentExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [\r\n  richTextExtension,\r\n  linkExtension,\r\n  blockFormatExtension,\r\n  listExtension,\r\n  tableExtension,\r\n  horizontalRuleExtension,\r\n  tabIndentExtension,\r\n] as const;\r\n\r\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\r\n\r\nfunction Toolbar() {\r\n  const { commands } = useEditor();\r\n  return (\r\n    <div>\r\n      <button onClick={() => commands.toggleUnorderedList?.()}>Bullets</button>\r\n      <button onClick={() => commands.toggleOrderedList?.()}>Numbers</button>\r\n      <button onClick={() => commands.insertLink?.('https://example.com')}>Link</button>\r\n      <button onClick={() => commands.insertTable?.({ rows: 3, columns: 3 })}>3x3 Table</button>\r\n    </div>\r\n  );\r\n}\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <Toolbar />\r\n      <RichText placeholder=\"Structure your document...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n",
    "urlPath": "/docs/luthor-headless/features/structure-and-lists/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features/structure-and-lists.md",
    "updatedAt": "2026-03-09T17:20:54.179Z"
  },
  {
    "slug": [
      "luthor-headless",
      "features",
      "typography-and-text"
    ],
    "title": "Typography and Text",
    "description": "Fonts, line-height, and text-formatting capabilities.",
    "content": "\r\n# Typography and Text\r\n\r\nThis group covers typography, essentials, and color controls.\r\n\r\n## Included extensions\r\n\r\n- `boldExtension`, `italicExtension`, `underlineExtension`, `strikethroughExtension`\r\n- `subscriptExtension`, `superscriptExtension`, `codeFormatExtension`\r\n- `fontFamilyExtension`, `fontSizeExtension`, `lineHeightExtension`\r\n- `textColorExtension`, `textHighlightExtension`\r\n\r\n## Example\r\n\r\n```tsx\r\nimport {\r\n  createEditorSystem,\r\n  RichText,\r\n  richTextExtension,\r\n  boldExtension,\r\n  italicExtension,\r\n  underlineExtension,\r\n  fontFamilyExtension,\r\n  fontSizeExtension,\r\n  lineHeightExtension,\r\n  textColorExtension,\r\n  textHighlightExtension,\r\n} from '@lyfie/luthor-headless';\r\n\r\nconst extensions = [\r\n  richTextExtension,\r\n  boldExtension,\r\n  italicExtension,\r\n  underlineExtension,\r\n  fontFamilyExtension,\r\n  fontSizeExtension,\r\n  lineHeightExtension,\r\n  textColorExtension,\r\n  textHighlightExtension,\r\n] as const;\r\n\r\nconst { Provider, useEditor } = createEditorSystem<typeof extensions>();\r\n\r\nfunction Toolbar() {\r\n  const { commands, activeStates } = useEditor();\r\n  return (\r\n    <div>\r\n      <button onClick={() => commands.toggleBold?.()} aria-pressed={activeStates.bold === true}>Bold</button>\r\n      <button onClick={() => commands.toggleItalic?.()} aria-pressed={activeStates.italic === true}>Italic</button>\r\n      <button onClick={() => commands.setTextColor?.('#2563eb')}>Blue</button>\r\n      <button onClick={() => commands.setTextHighlight?.('#fef08a')}>Highlight</button>\r\n    </div>\r\n  );\r\n}\r\n\r\nexport function App() {\r\n  return (\r\n    <Provider extensions={extensions}>\r\n      <Toolbar />\r\n      <RichText placeholder=\"Type styled content...\" />\r\n    </Provider>\r\n  );\r\n}\r\n```\r\n\r\n## Relevant props\r\n\r\n- `RichText.placeholder`: `undefined (default) | string`\r\n- `RichText.disabled`: `false (default) | true`\r\n\r\n",
    "urlPath": "/docs/luthor-headless/features/typography-and-text/",
    "sourcePath": "apps/web/src/content/docs/luthor-headless/features/typography-and-text.md",
    "updatedAt": "2026-02-24T19:18:59.749Z"
  },
  {
    "slug": [
      "luthor",
      "presets"
    ],
    "title": "Presets",
    "description": "Preset catalog for @lyfie/luthor, including per-preset docs.",
    "content": "\r\n# Presets\r\n\r\n`@lyfie/luthor` is a preset package built on top of `@lyfie/luthor-headless`.\r\n\r\n## Importing headless from presets package\r\n\r\n```ts\r\nimport { headless } from '@lyfie/luthor';\r\n```\r\n\r\n## Preset docs\r\n\r\n- [Extensive Editor](/docs/luthor/presets/extensive-editor/)\r\n- [Rich Text Input](/docs/luthor/presets/compose-editor/)\r\n- [Simple Text Input](/docs/luthor/presets/composer-editor/)\r\n- [MD Editor](/docs/luthor/presets/md-friendly-editor/)\r\n- [Slash Editor](/docs/luthor/presets/notion-like-editor/)\r\n- [Headless Text Input](/docs/luthor/presets/headless-editor-preset/)\r\n",
    "urlPath": "/docs/luthor/presets/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets.md",
    "updatedAt": "2026-03-09T17:20:54.179Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "compose-editor"
    ],
    "title": "Rich Text Input",
    "description": "Focused rich text compose preset with optional recipient rows.",
    "content": "\r\n# Rich Text Input\r\n\r\n`ComposeEditor` merges focused rich-text and draft-composition workflows into one surface.\r\n\r\nUse it as a clean rich editor, or enable recipient/subject rows when needed.\r\n\r\n## Usage\r\n\r\n```tsx\r\nimport { ComposeEditor } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return (\r\n    <ComposeEditor\r\n      compactToolbar\r\n      showTo\r\n      showCc\r\n      showSubject\r\n      placeholder=\"Write your draft...\"\r\n    />\r\n  );\r\n}\r\n```\r\n\r\n## Props\r\n\r\n`ComposeEditorProps` inherits `ExtensiveEditorProps` except `featureFlags`.\r\n\r\n- `featureFlags`: `undefined (default) | FeatureFlagOverrides`\r\n- `compactToolbar`: `false (default) | true`\r\n- `showRecipients`: `false (default) | true`\r\n- `showTo`: `false (default) | true`\r\n- `showCc`: `false (default) | true`\r\n- `showBcc`: `false (default) | true`\r\n- `showSubject`: `false (default) | true`\r\n\r\n## Behavior\r\n\r\n- Defaults to focused formatting with media/embed-heavy features disabled.\r\n- Optional recipient rows render above the editor shell.\r\n- Supports feature flag overrides for deeper tuning.\r\n\r\n",
    "urlPath": "/docs/luthor/presets/compose-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/compose-editor.md",
    "updatedAt": "2026-03-09T17:20:54.179Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "composer-editor"
    ],
    "title": "Simple Text Input",
    "description": "Constrained message composer preset with send controls.",
    "content": "\r\n# Simple Text Input\r\n\r\n`ComposerEditor` is a constrained message-composer preset.\r\n\r\nIt keeps formatting intentionally minimal and supports send workflows out of the box.\r\n\r\n## Usage\r\n\r\n```tsx\r\nimport { ComposerEditor } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return (\r\n    <ComposerEditor\r\n      placeholder=\"Type a message\"\r\n      submitOnEnter\r\n      allowShiftEnter\r\n      outputFormat=\"md\"\r\n      onSend={({ text }) => {\r\n        console.log(text);\r\n      }}\r\n    />\r\n  );\r\n}\r\n```\r\n\r\n## Props\r\n\r\n`ComposerEditorProps` is purpose-built for message input.\r\n\r\n- `formattingOptions`: `ComposerFormattingOptions`\r\n- `onSend`: `(payload: ComposerEditorSendPayload) => void`\r\n- `outputFormat`: `'md' (default) | 'json'`\r\n- `submitOnEnter`: `false (default) | true`\r\n- `allowShiftEnter`: `true (default) | false`\r\n- `showBottomToolbar`: `true (default) | false`\r\n- `toolbarButtons`: `readonly ComposerToolbarButton[]`\r\n- `sendButtonPlacement`: `'inside' (default) | 'right'`\r\n- `minHeight` / `maxHeight` / `minWidth` / `maxWidth`\r\n\r\n## Behavior\r\n\r\n- Allows only bold, italic, and strikethrough formatting.\r\n- Always runs visual mode only.\r\n- Supports auto-grow until `maxHeight`, then internal scrolling.\r\n\r\n",
    "urlPath": "/docs/luthor/presets/composer-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/composer-editor.md",
    "updatedAt": "2026-03-09T17:20:54.179Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "extensive-editor"
    ],
    "title": "Extensive Editor",
    "description": "Full-feature preset and core prop reference.",
    "content": "\r\n# Extensive Editor\r\n\r\n`ExtensiveEditor` is the base full-feature preset editor.\r\n\r\n## Usage\r\n\r\n```tsx\r\nimport { ExtensiveEditor } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return <ExtensiveEditor placeholder=\"Write anything...\" />;\r\n}\r\n```\r\n\r\n## Core props\r\n\r\n- `initialTheme`: `'light' (default) | 'dark'`\r\n- `onThemeChange`: `(theme: 'light' | 'dark') => void`\r\n- `showDefaultContent`: `true (default) | false`\r\n- `placeholder`: `'Write anything...' (default) | string | { visual?: string; json?: string }`\r\n- `initialMode`: `'visual' (default) | 'json'`\r\n- `availableModes`: `['visual', 'json'] (default) | ('visual' | 'json')[]`\r\n- `toolbarPosition`: `'top' (default) | 'bottom'`\r\n- `toolbarAlignment`: `'left' (default) | 'center' | 'right'`\r\n- `isToolbarEnabled`: `true (default) | false`\r\n- `minimumDefaultLineHeight`: `1.5 (default) | string | number`\r\n- `scaleByRatio`: `false (default) | true`\r\n- `syncHeadingOptionsWithCommands`: `true (default) | false`\r\n- `commandPaletteShortcutOnly`: `false (default) | true`\r\n- `isCopyAllowed`: `true (default) | false`\r\n- `syntaxHighlighting`: `'auto' | 'disabled'` | extension default behavior if omitted\r\n- `maxListIndentation`: `8 (default) | number` (sub-indent levels below root)\r\n\r\n## Lists in Extensive\r\n\r\n- Ordered, unordered, and checklist styles are implemented in `@lyfie/luthor-headless` and surfaced in the preset toolbar.\r\n- `maxListIndentation` applies to all list types (ordered, unordered, checklist), including `Tab` and command-based indentation.\r\n- Checklist supports two variants:\r\n  - `strikethrough` (default): checked items render line-through text.\r\n  - `plain`: checked items do not strike through text.\r\n\r\n## Theme callback example (`highlight.js`)\r\n\r\nUse `onThemeChange` when host styling must follow the editor's internal theme state (for example, swapping `highlight.js` light/dark styles).\r\n\r\n```tsx\r\n'use client';\r\n\r\nimport { ExtensiveEditor } from '@lyfie/luthor';\r\nimport { useEffect, useState } from 'react';\r\n\r\ntype Theme = 'light' | 'dark';\r\nconst HIGHLIGHT_THEME_LINK_ID = 'luthor-highlightjs-theme';\r\n\r\nexport function EditorWithHighlightTheme() {\r\n  const [editorTheme, setEditorTheme] = useState<Theme>('light');\r\n\r\n  useEffect(() => {\r\n    const href =\r\n      editorTheme === 'dark'\r\n        ? '/highlightjs/github-dark.css'\r\n        : '/highlightjs/github.css';\r\n\r\n    const existing = document.getElementById(HIGHLIGHT_THEME_LINK_ID);\r\n    const link =\r\n      existing instanceof HTMLLinkElement\r\n        ? existing\r\n        : document.createElement('link');\r\n\r\n    if (!(existing instanceof HTMLLinkElement)) {\r\n      link.id = HIGHLIGHT_THEME_LINK_ID;\r\n      link.rel = 'stylesheet';\r\n      document.head.appendChild(link);\r\n    }\r\n\r\n    if (link.href !== new URL(href, window.location.origin).href) {\r\n      link.href = href;\r\n    }\r\n  }, [editorTheme]);\r\n\r\n  return (\r\n    <ExtensiveEditor\r\n      initialTheme=\"light\"\r\n      onThemeChange={setEditorTheme}\r\n      toolbarAlignment=\"center\"\r\n    />\r\n  );\r\n}\r\n```\r\n\r\nPlace these files in your app static assets:\r\n\r\n- `/public/highlightjs/github.css`\r\n- `/public/highlightjs/github-dark.css`\r\n\r\n## Ref API\r\n\r\n- `injectJSON(content: string): void`\r\n- `getJSON(): string`\r\n\r\n## Notes\r\n\r\nThis is the base preset that other presets build on.\r\n\r\n\r\n\r\n\r\n",
    "urlPath": "/docs/luthor/presets/extensive-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/extensive-editor.md",
    "updatedAt": "2026-03-09T17:20:54.190Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "headless-editor-preset"
    ],
    "title": "Headless Text Input",
    "description": "Reference preset showing direct headless composition.",
    "content": "\r\n# Headless Text Input\r\n\r\nSmall reference preset demonstrating direct headless composition.\r\n\r\n## Usage\r\n\r\n```tsx\r\nimport { HeadlessEditorPreset } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return <HeadlessEditorPreset placeholder=\"Start writing...\" />;\r\n}\r\n```\r\n\r\n## Props\r\n\r\n- `className`: `undefined (default) | string`\r\n- `placeholder`: `'Start writing...' (default) | string`\r\n\r\n## Behavior\r\n\r\nUses a minimal extension set (`richText`, `history`, `bold`, `italic`, `underline`, `list`) and a lightweight toolbar.\r\n\r\n\r\n",
    "urlPath": "/docs/luthor/presets/headless-editor-preset/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/headless-editor-preset.md",
    "updatedAt": "2026-03-09T17:20:54.221Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "md-friendly-editor"
    ],
    "title": "MD Editor",
    "description": "Visual and markdown mode preset with mode-switch behavior.",
    "content": "\r\n# MD Editor\r\n\r\nPreset that switches between visual and markdown editing.\r\n\r\n## Usage\r\n\r\n```tsx\r\nimport { MDFriendlyEditor } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return <MDFriendlyEditor initialMode=\"visual\" />;\r\n}\r\n```\r\n\r\n## Props\r\n\r\n`MDFriendlyEditorProps` inherits `ExtensiveEditorProps` except `availableModes` and `initialMode`.\r\n\r\n- `initialMode`: `'visual' (default) | 'markdown'`\r\n\r\n## Behavior\r\n\r\n- Converts visual JSON to markdown when switching to markdown mode.\r\n- Parses markdown back into visual JSON when switching back.\r\n- Renders source textarea in markdown mode.\r\n\r\n",
    "urlPath": "/docs/luthor/presets/md-friendly-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/md-friendly-editor.md",
    "updatedAt": "2026-03-09T17:20:54.221Z"
  },
  {
    "slug": [
      "luthor",
      "presets",
      "notion-like-editor"
    ],
    "title": "Slash Editor",
    "description": "Slash-first preset with draggable and command-focused defaults.",
    "content": "\r\n# Slash Editor\r\n\r\nSlash-first preset with draggable-focused defaults.\r\n\r\n## Usage\r\n\r\n```tsx\r\nimport { NotionLikeEditor } from '@lyfie/luthor';\r\nimport '@lyfie/luthor/styles.css';\r\n\r\nexport function App() {\r\n  return <NotionLikeEditor isDraggableEnabled slashVisibility={{ allowlist: ['block.paragraph'] }} />;\r\n}\r\n```\r\n\r\n## Props\r\n\r\n`NotionLikeEditorProps` inherits `ExtensiveEditorProps` except `featureFlags` and `isToolbarEnabled`, then re-adds both.\r\n\r\n- `slashVisibility`: `undefined (default) | SlashCommandVisibility`\r\n- `isDraggableEnabled`: `true (default) | false`\r\n- `featureFlags`: `undefined (default) | FeatureFlagOverrides`\r\n- `isToolbarEnabled`: `false (default) | true`\r\n\r\n## Behavior\r\n\r\nDefaults enable slash commands, draggable blocks, and command palette while keeping toolbar hidden.\r\n\r\n",
    "urlPath": "/docs/luthor/presets/notion-like-editor/",
    "sourcePath": "apps/web/src/content/docs/luthor/presets/notion-like-editor.md",
    "updatedAt": "2026-03-09T17:20:54.228Z"
  }
];
