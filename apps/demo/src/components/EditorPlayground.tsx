import type { ReactNode } from "react";

interface EditorPlaygroundProps {
  children: ReactNode;
}

export function EditorPlayground({ children }: EditorPlaygroundProps) {
  return (
    <section className="editor-panel" aria-label="Extensive editor live canvas">
      <div className="editor-panel__frame">
        <div className="editor-panel__container">{children}</div>
      </div>
    </section>
  );
}
