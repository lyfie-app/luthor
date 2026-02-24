import {
  ChatWindowEditor,
  EmailComposeEditor,
  ExtensiveEditor,
  HeadlessEditorPreset,
  MDTextEditor,
  NotionLikeEditor,
  NotesEditor,
  RichTextBoxEditor,
  SimpleTextEditor,
} from "@lyfie/luthor";
import "@lyfie/luthor/styles.css";
import { useMemo, useState } from "react";
import { useDemoTheme } from "./hooks/useDemoTheme";
import "highlight.js/styles/github.css";

function App() {
  const { theme, toggleTheme } = useDemoTheme();
  const [preset, setPreset] = useState("extensive");

  const fontFamilyOptions = [
    { value: "default", label: "Default", fontFamily: "inherit" },
    {
      value: "geist",
      label: "Geist",
      fontFamily: "'Geist', 'Segoe UI', Arial, sans-serif",
      cssImportUrl: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap",
    },
    {
      value: "comfortaa",
      label: "Comfortaa",
      fontFamily: "'Comfortaa', 'Segoe UI', Arial, sans-serif",
      cssImportUrl: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap",
    },
  ];
  const presetNode = useMemo(() => {
    switch (preset) {
      case "simple-text":
        return <SimpleTextEditor showDefaultContent={false} placeholder="Simple text only..." />;
      case "rich-text-box":
        return <RichTextBoxEditor showDefaultContent={false} compactToolbar placeholder="Short rich text..." />;
      case "chat-window":
        return <ChatWindowEditor showDefaultContent={false} onSend={(payload) => console.log("chat send", payload)} />;
      case "email-compose":
        return <EmailComposeEditor showDefaultContent={false} showCc showSubject />;
      case "md-text":
        return <MDTextEditor showDefaultContent={false} />;
      case "notion-like":
        return <NotionLikeEditor showDefaultContent={false} />;
      case "headless-editor":
        return <HeadlessEditorPreset />;
      case "notes":
        return <NotesEditor showDefaultContent={false} />;
      default:
        return (
          <ExtensiveEditor
            initialTheme={theme}
            syntaxHighlighting="auto"
            toolbarPosition="top"
            toolbarAlignment="center"
            toolbarVisibility={{ fontFamily: true }}
            toolbarClassName="docs-toolbar"
            quoteClassName="docs-quote"
            quoteStyleVars={{
              "--luthor-quote-bg": "#fff7ed",
              "--luthor-quote-fg": "#7c2d12",
              "--luthor-quote-border": "#ea580c",
            }}
            fontFamilyOptions={fontFamilyOptions}
            fontSizeOptions={[
              { value: "default", label: "Default", fontSize: "inherit" },
              { value: "13", label: "13px", fontSize: "13px" },
              { value: "17", label: "17px", fontSize: "17px" },
              { value: "21", label: "21px", fontSize: "21px" },
            ]}
            minimumDefaultLineHeight={1}
            lineHeightOptions={[
              { value: "default", label: "Default", lineHeight: "normal" },
              { value: "1", label: "1.0", lineHeight: "1" },
              { value: "1.15", label: "1.15", lineHeight: "1.15" },
              { value: "1.5", label: "1.5", lineHeight: "1.5" },
              { value: "1.75", label: "1.75", lineHeight: "1.75" },
              { value: "2", label: "2.0", lineHeight: "2" },
            ]}
            paragraphLabel="Normal"
            headingOptions={["h1", "h2", "h3"]}
            scaleByRatio={false}
            slashCommandVisibility={[
              { "block.quote": true },
              { "block.paragraph": true },
              { "block.heading1": true },
            ]}
            isCopyAllowed={true}
            placeholder={{
              visual: "Write your story...",
              jsonb: "Paste JSONB document...",
            }}
            isDraggableBoxEnabled={true}
            defaultSettings={{
              link: { color: "#1d4ed8" },
              list: { markerColor: "#1f2937", checkboxColor: "#2563eb" },
              table: { borderColor: "#cbd5e1", headerBackgroundColor: "#f1f5f9" },
              hr: { color: "#cbd5e1" },
              placeholder: { color: "#94a3b8" },
              toolbar: { backgroundColor: "#f8fafc" },
            }}
            commandPaletteShortcutOnly={false}
            shortcutConfig={{
              disabledCommandIds: ["format.italic", "format.bold"],
              bindings: {
                "format.bold": { key: "m", ctrlKey: true },
                "palette.show": [
                  { key: "k", ctrlKey: true, shiftKey: true },
                ],
              },
            }}
          />
        );
    }
  }, [fontFamilyOptions, preset, theme]);

  return (
    <div className="app-shell" data-theme={theme}>
      <button
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          padding: "8px 16px",
          borderRadius: 8,
          border: "none",
          background: theme === "dark" ? "#222" : "#eee",
          color: theme === "dark" ? "#fff" : "#222",
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={toggleTheme}
      >
        {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
      </button>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <select
          value={preset}
          onChange={(event) => setPreset(event.target.value)}
          style={{ height: 36, borderRadius: 8, padding: "0 10px" }}
        >
          <option value="extensive">Extensive</option>
          <option value="simple-text">Simple Text</option>
          <option value="rich-text-box">Rich Text Box</option>
          <option value="chat-window">Chat Window</option>
          <option value="email-compose">Email Compose</option>
          <option value="md-text">MD Text</option>
          <option value="notion-like">Notion Like</option>
          <option value="headless-editor">Headless</option>
          <option value="notes">Notes</option>
        </select>
        {presetNode}
      </div>
    </div>
  );
}

export default App;
