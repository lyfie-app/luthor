import { useLayoutEffect, useRef } from "react";
import type { CoreEditorMode } from "./types";

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
  const orderedModes: CoreEditorMode[] = ["visual", "json", "markdown", "html"];
  const modeSet = new Set(availableModes ?? ["visual", "json", "markdown", "html"]);
  const modes = orderedModes.filter((candidate) => modeSet.has(candidate));
  const tabLabels: Record<CoreEditorMode, string> = {
    visual: labels?.visual ?? "Visual",
    json: labels?.json ?? "JSON",
    markdown: labels?.markdown ?? "Markdown",
    html: labels?.html ?? "HTML",
  };

  return (
    <div className="luthor-mode-tabs">
      {modes.map((tabMode) => (
        <button key={tabMode} className={`luthor-mode-tab ${mode === tabMode ? "active" : ""}`} onClick={() => onModeChange(tabMode)}>
          {tabLabels[tabMode]}
          {isConverting === tabMode && <span className="luthor-tab-converting-spinner" />}
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
    const nextHeight = Math.max(textarea.scrollHeight, 280);
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
