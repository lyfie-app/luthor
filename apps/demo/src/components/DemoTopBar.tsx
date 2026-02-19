import { NavLink } from "react-router-dom";

interface DemoTopBarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLoadDemoContent?: () => void;
  repositoryUrl: string;
  luthorNpmUrl: string;
  headlessNpmUrl: string;
}

export function DemoTopBar({
  theme,
  onToggleTheme,
  onLoadDemoContent,
  repositoryUrl,
  luthorNpmUrl,
  headlessNpmUrl,
}: DemoTopBarProps) {
  return (
    <header className="demo-topbar">
      <div className="demo-brand">
        <span className="demo-brand__dot" aria-hidden="true" />
        <div>
          <p className="demo-brand__kicker">Luthor Showcase</p>
          <strong>Extensive Editor</strong>
        </div>
      </div>

      <nav className="demo-nav" aria-label="Website sections">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "demo-nav__link demo-nav__link--active" : "demo-nav__link")}>
          Home
        </NavLink>
        <NavLink to="/demo" className={({ isActive }) => (isActive ? "demo-nav__link demo-nav__link--active" : "demo-nav__link")}>
          Demo
        </NavLink>
        <NavLink to="/docs" className={({ isActive }) => (isActive ? "demo-nav__link demo-nav__link--active" : "demo-nav__link")}>
          Documentation
        </NavLink>
        <NavLink
          to="/ecosystem"
          className={({ isActive }) => (isActive ? "demo-nav__link demo-nav__link--active" : "demo-nav__link")}
        >
          Ecosystem
        </NavLink>
      </nav>

      <div className="demo-topbar__actions">
        <a className="demo-button demo-button--ghost demo-icon-button" href={repositoryUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true" className="demo-icon">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.25c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.23-3.23-.12-.31-.53-1.56.12-3.24 0 0 1-.32 3.3 1.24a11.5 11.5 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.68.24 2.93.12 3.24.77.84 1.23 1.92 1.23 3.23 0 4.62-2.8 5.63-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.58A12 12 0 0 0 12 .5Z" />
            </svg>
          </span>
          GitHub
        </a>
        <a className="demo-button demo-button--ghost demo-icon-button" href={luthorNpmUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true" className="demo-icon demo-icon--npm">npm</span>
          Luthor
        </a>
        <a className="demo-button demo-button--ghost demo-icon-button" href={headlessNpmUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true" className="demo-icon demo-icon--npm">npm</span>
          Headless
        </a>
        <button type="button" className="demo-button demo-button--ghost demo-theme-button" onClick={onToggleTheme} aria-label="Toggle theme">
          <span aria-hidden="true" className="demo-icon">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
        </button>
        {onLoadDemoContent ? (
          <button type="button" className="demo-button" onClick={onLoadDemoContent}>
            Load Demo Content
          </button>
        ) : null}
      </div>
    </header>
  );
}
