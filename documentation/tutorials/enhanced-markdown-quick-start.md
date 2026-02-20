# JSONB Persistence Quick Start (Replaces Legacy Enhanced Markdown Tutorial)

This path now uses Visual/JSONB-only workflows.

## Current recommendation

- Use `editor.getJSONB()` to serialize state.
- Use `editor.injectJSONB(payload)` to restore state.
- Treat JSONB as canonical persistence format.

## Minimal example

```tsx
const handleSave = () => {
  const payload = editorRef.current?.getJSONB();
  if (!payload) return;
  localStorage.setItem("editor-jsonb", payload);
};

const handleRestore = () => {
  const payload = localStorage.getItem("editor-jsonb");
  if (!payload) return;
  editorRef.current?.injectJSONB(payload);
};
```

## Why this changed

Legacy HTML/Markdown mode and enhanced-markdown converter guidance has been retired from active workflows.
Use JSONB for deterministic round-trips and production persistence.

## Related docs

- Import/export: [../user/headless/import-export.md](../user/headless/import-export.md)
- Demo usage: [../user/demo/usage-and-persistence.md](../user/demo/usage-and-persistence.md)
- Luthor extensive editor: [../user/luthor/extensive-editor.md](../user/luthor/extensive-editor.md)
