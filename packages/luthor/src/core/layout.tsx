import type { CoreEditorMode } from "./types";

export function ModeTabs({
  mode,
  onModeChange,
  labels,
}: {
  mode: CoreEditorMode;
  onModeChange: (mode: CoreEditorMode) => void;
  labels?: Partial<Record<CoreEditorMode, string>>;
}) {
  const tabLabels: Record<CoreEditorMode, string> = {
    visual: labels?.visual ?? "Visual",
    html: labels?.html ?? "HTML",
    markdown: labels?.markdown ?? "Markdown",
  };

  return (
    <div className="luthor-mode-tabs">
      <button className={`luthor-mode-tab ${mode === "visual" ? "active" : ""}`} onClick={() => onModeChange("visual")}>
        {tabLabels.visual}
      </button>
      <button className={`luthor-mode-tab ${mode === "html" ? "active" : ""}`} onClick={() => onModeChange("html")}>
        {tabLabels.html}
      </button>
      <button className={`luthor-mode-tab ${mode === "markdown" ? "active" : ""}`} onClick={() => onModeChange("markdown")}>
        {tabLabels.markdown}
      </button>
    </div>
  );
}

export function SourceView({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <textarea
      className={`luthor-source-view${className ? ` ${className}` : ""}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      spellCheck={false}
    />
  );
}