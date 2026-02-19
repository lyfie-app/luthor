# Content Conversion V2 Architecture (JSONB ↔ HTML ↔ Markdown ↔ Visual)

## Goal

Guarantee stable, repeatable round-trips across these four representations:

1. Visual editor state (Lexical runtime)
2. JSONB (serialized lexical state)
3. Enhanced HTML
4. Enhanced Markdown

The same document should survive repeated conversions without structural drift, styling loss, or extension data corruption.

## Current Root-Cause Issues

### 1) Two parallel markdown pipelines

- `MarkdownExtension` uses Lexical transformers (`$convertToMarkdownString`, `$convertFromMarkdownString`).
- `EnhancedMarkdownConvertor` uses a separate custom parser/serializer.
- The two code paths are not equivalent, so behavior diverges over time.

### 2) Custom markdown parser is lossy by design

`EnhancedMarkdownConvertor.enhancedMarkdownToLexicalJSON` reconstructs only a limited subset of nodes and formatting:

- Supports only a few block types in metadata (`youtube-embed`, `iframe-embed`, `image`).
- Flattens or degrades rich structures (tables, nested lists, advanced inline marks).
- Does not preserve all inline style semantics (font family/size, text color/highlight, line height, etc.).

### 3) Transformer integration is placeholder-only

`EnhancedMarkdownTransformers.ts` is currently scaffolding with an empty transformer list. That means enhanced markdown fidelity is not integrated into the canonical markdown extension path.

### 4) HTML path is robust only when metadata remains intact

`EnhancedHTMLConvertor` can restore exact state from embedded `LUTHOR_STATE`, but falls back to DOM import when metadata is missing or hash verification fails, which can lose extension-specific semantics.

### 5) Core import/export API surface is incomplete

`createEditorSystem` still exposes placeholder import/export methods, encouraging ad-hoc conversion handling in presets.

## Non-Negotiable Invariants

All V2 work should enforce these invariants:

1. **Canonical Source Invariant**: JSONB is the canonical representation.
2. **Idempotence Invariant**: Converting any format to canonical and back must be stable.
3. **Extension Invariant**: Every extension node has a codec for markdown/html round-trip.
4. **Style Invariant**: Inline style tokens are normalized and preserved (not raw free-form drift).
5. **Order/Identity Invariant**: Block order and stable node identity survive each round-trip.

## Proposed Architecture

## 1) Canonical document envelope

Introduce a typed envelope for storage/transport:

```ts
type LuthorDocumentEnvelopeV2 = {
  version: 2;
  canonical: {
    format: 'jsonb';
    state: unknown;
    checksum: string;
  };
  projections: {
    html?: {
      value: string;
      checksum: string;
      metadataVersion: 2;
    };
    markdown?: {
      value: string;
      checksum: string;
      metadataVersion: 2;
    };
  };
  generatedAt: string;
};
```

Notes:

- JSONB remains source of truth.
- HTML/Markdown are projections, regenerated from canonical when needed.
- Checksums prevent stale projection reuse.

## 2) Single conversion kernel (one path per direction)

Add a headless service (example: `ContentConversionService`) with strict APIs:

- `fromVisual(editorState) -> canonical`
- `toVisual(canonical) -> editorState`
- `canonicalToHTML(canonical) -> enhancedHTML`
- `canonicalToMarkdown(canonical) -> enhancedMarkdown`
- `htmlToCanonical(html) -> canonical`
- `markdownToCanonical(markdown) -> canonical`

No preset or app should call ad-hoc convertors directly.

## 3) Extension codec registry

Each extension contributes a codec contract:

```ts
type ExtensionCodec = {
  nodeType: string;
  toMarkdownDirective?: (node: unknown) => MarkdownDirective | null;
  fromMarkdownDirective?: (directive: MarkdownDirective) => unknown | null;
  toHtmlDataAttrs?: (node: unknown) => Record<string, string>;
  fromHtmlDataAttrs?: (attrs: Record<string, string>) => unknown | null;
  normalize?: (node: unknown) => unknown;
};
```

Why this matters:

- Moves conversion ownership to extension modules.
- Prevents one giant switch statement becoming a maintenance bottleneck.
- Makes new extensions round-trip-safe by contract.

## 4) Markdown strategy: standard markdown + typed directives

Use Lexical transformers as primary markdown pipeline. Add enhanced directives as a formal grammar (not free-form comments):

```md
<!-- LUTHOR:DIRECTIVE {"v":2,"type":"youtube-embed","id":"node-123","payload":{...}} -->
```

Rules:

- Every directive includes `v`, `type`, and stable `id`.
- Payload schema is validated before node reconstruction.
- Unknown directives are preserved as opaque metadata instead of dropped.

## 5) Style normalization layer

Map inline style state to normalized tokens before projection:

- `font-family` → allowed token or explicit fallback
- `font-size` → tokenized scale
- `color` / `background-color` → normalized color form
- `line-height` → normalized ratio token

This removes style drift from repeated projection cycles.

## 6) HTML strategy

- Keep `LUTHOR_STATE` metadata marker.
- Add extension-level data attributes for graceful degradation (`data-luthor-*`).
- If metadata hash mismatch occurs, attempt structured recovery via codecs before plain DOM fallback.

## 7) Core API unification

Replace placeholders in `createEditorSystem` import/export with the conversion service.

- `export.toHTML`, `export.toMarkdown`, `export.toJSON`
- `import.fromHTML`, `import.fromMarkdown`, `import.fromJSON`

This removes duplicate conversion behavior from presets.

## Migration Plan

## Phase 0 — Safety and observability

1. Add conversion telemetry hooks (success/fallback/parse errors).
2. Add checksum + version reporting in exported markdown/html metadata.
3. Add round-trip diagnostics command for developer mode.

## Phase 1 — Canonical kernel

1. Introduce `ContentConversionService` in `packages/headless/src/utils`.
2. Route existing export/import commands through this service.
3. Keep legacy converter APIs as wrappers with deprecation warnings.

## Phase 2 — Codec coverage

1. Implement codecs for current critical nodes:
   - image
   - iframe-embed
   - youtube-embed
   - tables
   - links
   - code blocks
2. Add inline style codec coverage for font/color/line-height families.

## Phase 3 — Markdown transformer completion

1. Replace `EnhancedMarkdownTransformers` placeholders with real transformers.
2. Remove custom markdown parser as primary path.
3. Keep parser only as compatibility fallback for old documents.

## Phase 4 — Hardening

1. Add property-based round-trip tests for each extension payload.
2. Add cross-format loop tests:
   - Visual → MD → Visual → MD
   - Visual → HTML → Visual → HTML
   - Visual → MD → HTML → JSONB → Visual
3. Block release when invariants fail.

## Test Matrix (Minimum)

For each extension and style capability:

1. Single conversion test (to each format)
2. Double round-trip idempotence test
3. Mixed-content stress test (nested structures + media + styles)
4. Compatibility test (legacy metadata v1 input)

Equality checks should compare normalized lexical JSON (ignore ephemeral keys, keep semantic keys).

## Immediate High-Impact Fixes

1. Stop treating `enhancedMarkdownToLexicalJSON` as a full-fidelity parser for all content.
2. Prefer canonical JSONB restoration when present.
3. Wire `MarkdownExtension` and enhanced metadata through one pipeline.
4. Implement core import/export methods in `createEditorSystem` to avoid preset-level hacks.

## Definition of Done for V2

V2 is complete only when:

1. Round-trip invariants pass across supported extensions and style systems.
2. Presets use core import/export APIs only (no custom conversion path duplication).
3. New extension PRs must include codec + round-trip tests.
4. Legacy enhanced markdown remains readable and importable via compatibility layer.

---

This architecture keeps JSONB as the canonical truth while making HTML and Markdown robust, deterministic projections with strong compatibility guarantees.