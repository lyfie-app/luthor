interface DemoTopBarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLoadDemoContent: () => void;
}

export function DemoTopBar({ theme, onToggleTheme, onLoadDemoContent }: DemoTopBarProps) {
  return (
    <header className="demo-topbar">
      <div className="demo-brand">
        <span className="demo-brand__dot" aria-hidden="true" />
        <div>
          <p className="demo-brand__kicker">Luthor Showcase</p>
          <strong>Extensive Editor</strong>
        </div>
      </div>

      <div className="demo-topbar__actions">
        <button type="button" className="demo-button demo-button--ghost" onClick={onToggleTheme}>
          {theme === "dark" ? "Switch to light" : "Switch to dark"}
        </button>
        <button type="button" className="demo-button" onClick={onLoadDemoContent}>
          Load Demo Content
        </button>
      </div>
    </header>
  );
}
