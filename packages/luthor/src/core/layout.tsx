import { useLayoutEffect, useRef } from "react";
import type { CoreEditorMode } from "./types";

const SOURCE_VIEW_MIN_HEIGHT = 400;

export function ModeTabs({
  mode,
  onModeChange,
  labels,
  availableModes,
  isConverting,
}: {
  mode: CoreEditorMode;
  onModeChange: (mode: CoreEditorMode) => void;
  labels?: Partial<Record<CoreEditorMode, string>>;
  availableModes?: readonly CoreEditorMode[];
  isConverting?: CoreEditorMode | null;
}) {
  type CanonicalMode = Exclude<CoreEditorMode, "visual">;
  const toCanonicalMode = (value: CoreEditorMode): CanonicalMode =>
    value === "visual" ? "visual-editor" : value;
  const preferredVisualMode: CoreEditorMode = (availableModes ?? []).includes("visual-editor")
    ? "visual-editor"
    : "visual";
  const fromCanonicalMode = (value: CanonicalMode): CoreEditorMode => {
    if (value === "visual-editor") {
      return preferredVisualMode;
    }
    return value;
  };

  const orderedModes: CanonicalMode[] = ["visual-only", "visual-editor", "json", "markdown", "html"];
  const sourceModes = availableModes ?? ["visual-only", "visual-editor", "json", "markdown", "html"];
  const modeSet = new Set<CanonicalMode>(sourceModes.map(toCanonicalMode));
  const modes = orderedModes.filter((candidate) => modeSet.has(candidate));
  const activeMode = toCanonicalMode(mode);
  const convertingMode = isConverting ? toCanonicalMode(isConverting) : null;
  const tabLabels: Record<CanonicalMode, string> = {
    "visual-only": labels?.["visual-only"] ?? "Visual Only",
    "visual-editor": labels?.["visual-editor"] ?? labels?.visual ?? "Visual Editor",
    json: labels?.json ?? "JSON",
    markdown: labels?.markdown ?? "Markdown",
    html: labels?.html ?? "HTML",
  };

  return (
    <div className="luthor-mode-tabs">
      {modes.map((tabMode) => (
        <button
          key={tabMode}
          className={`luthor-mode-tab ${activeMode === tabMode ? "active" : ""}`}
          onClick={() => onModeChange(fromCanonicalMode(tabMode))}
        >
          {tabLabels[tabMode]}
          {convertingMode === tabMode && <span className="luthor-tab-converting-spinner" />}
        </button>
      ))}
    </div>
  );
}

export function SourceView({
  value,
  onChange,
  placeholder,
  className,
  wrap,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  wrap?: "soft" | "hard" | "off";
}) {
  const sourceRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = sourceRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    const textareaChromeHeight = Math.max(0, textarea.offsetHeight - textarea.clientHeight);
    const nextHeight = Math.max(textarea.scrollHeight + textareaChromeHeight + 1, SOURCE_VIEW_MIN_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={sourceRef}
      className={`luthor-source-view${className ? ` ${className}` : ""}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      wrap={wrap ?? "off"}
    />
  );
}
