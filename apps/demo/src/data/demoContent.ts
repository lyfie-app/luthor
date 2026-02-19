export const EXTENSIVE_DEMO_MARKDOWN = `# Extensive Editor: Full Capability Snapshot

Use this editor as a complete production-ready sandbox.

## Text and Typography

- **Bold**, *italic*, <u>underline</u>, ~~strikethrough~~
- Subscript and superscript
- Font family, font size, and line-height controls
- Text color and highlight controls

## Rich Structure

- Headings, paragraph, quote, and code blocks
- Bulleted, numbered, and check lists
- Horizontal rule insertion
- Tables with row/column editing tools

## Media + Power Tools

- Image insertion with resizing and alignment
- HTML embed blocks, iframe embeds, YouTube videos, and Tweet/X posts
- Floating toolbar on text selection
- Context menu and draggable block controls

## Productivity

- Undo/redo history
- Command palette (Ctrl+Shift+P)
- HTML + Markdown source mode round-trips
- Custom feature-card node support
`;

export const CATEGORY_BY_EXTENSION: Record<string, string> = {
  bold: "Text",
  italic: "Text",
  underline: "Text",
  strikethrough: "Text",
  subscript: "Text",
  superscript: "Text",
  link: "Text",
  fontFamily: "Typography",
  fontSize: "Typography",
  lineHeight: "Typography",
  textColor: "Typography",
  textHighlight: "Typography",
  blockFormat: "Structure",
  list: "Structure",
  table: "Structure",
  horizontalRule: "Structure",
  code: "Code",
  codeFormat: "Code",
  codeIntelligence: "Code",
  tabIndent: "Workflow",
  enterKeyBehavior: "Workflow",
  history: "Workflow",
  commandPalette: "Workflow",
  contextMenu: "Workflow",
  draggableBlock: "Workflow",
  floatingToolbar: "Workflow",
  image: "Media",
  htmlEmbed: "Media",
  markdown: "Import / Export",
  html: "Import / Export",
  featureCard: "Custom",
};

export const CATEGORY_ORDER = [
  "Text",
  "Typography",
  "Structure",
  "Code",
  "Media",
  "Workflow",
  "Import / Export",
  "Custom",
  "Other",
] as const;

export const SHOWCASE_HIGHLIGHTS = [
  "Visual + HTML + Markdown mode switching",
  "Command palette, slash menu, and context menu workflows",
  "Media tooling: image, iframe, and YouTube embeds",
  "Formatting depth: text, structure, code, and custom cards",
];
