'use client';

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
  presetRegistry,
} from '@lyfie/luthor';
import { useEffect, useMemo, useState } from 'react';
import { PRIMARY_PACKAGE_NAME } from '@/config/site';

type Theme = 'light' | 'dark';

const presetEntries = Object.values(presetRegistry);
const fallbackPreset = { id: 'extensive', label: 'Extensive' };

function resolveTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

type PresetRendererProps = {
  presetId: string;
  siteTheme: Theme;
};

function PresetRenderer({ presetId, siteTheme }: PresetRendererProps) {
  switch (presetId) {
    case 'simple-text':
      return <SimpleTextEditor initialTheme={siteTheme} placeholder="Type plain text..." />;
    case 'rich-text-box':
      return <RichTextBoxEditor initialTheme={siteTheme} showDefaultContent />;
    case 'chat-window':
      return <ChatWindowEditor initialTheme={siteTheme} placeholder="Ask anything..." />;
    case 'email-compose':
      return <EmailComposeEditor initialTheme={siteTheme} showDefaultContent />;
    case 'md-text':
      return <MDTextEditor initialTheme={siteTheme} showDefaultContent />;
    case 'notion-like':
      return <NotionLikeEditor initialTheme={siteTheme} showDefaultContent />;
    case 'headless-editor':
      return <HeadlessEditorPreset placeholder="Start writing..." />;
    case 'notes':
      return <NotesEditor initialTheme={siteTheme} showDefaultContent />;
    case 'extensive':
    default:
      return <ExtensiveEditor initialTheme={siteTheme} showDefaultContent toolbarAlignment="center" />;
  }
}

export function PresetShowcaseClient() {
  const [siteTheme, setSiteTheme] = useState<Theme>('light');
  const [selectedPresetId, setSelectedPresetId] = useState(() => {
    return presetEntries.find((preset) => preset.id === 'extensive')?.id ?? presetEntries[0]?.id ?? 'extensive';
  });

  useEffect(() => {
    setSiteTheme(resolveTheme());

    const observer = new MutationObserver(() => {
      setSiteTheme(resolveTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const activePreset = useMemo(() => {
    return presetEntries.find((preset) => preset.id === selectedPresetId) ?? presetEntries[0] ?? fallbackPreset;
  }, [selectedPresetId]);

  return (
    <div className="demo-showcase-layout">
      <aside className="demo-preset-sidebar" aria-label="Preset navigation">
        <h2>Presets</h2>
        <p className="demo-preset-sidebar-copy">Pick any preset from {PRIMARY_PACKAGE_NAME}.</p>
        <nav>
          {presetEntries.map((preset) => {
            const isActive = preset.id === activePreset.id;

            return (
              <button
                key={preset.id}
                type="button"
                className={['demo-preset-nav-item', isActive ? 'is-active' : ''].filter(Boolean).join(' ')}
                onClick={() => setSelectedPresetId(preset.id)}
                aria-current={isActive ? 'true' : undefined}
              >
                <span>{preset.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="browser-frame demo-showcase-frame">
        <div className="browser-frame-header">
          <div className="window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <code className="install-chip">
            {PRIMARY_PACKAGE_NAME} {activePreset.id}
          </code>
        </div>
        <div className="editor-pane demo-showcase-editor-pane">
          <PresetRenderer key={`${activePreset.id}-${siteTheme}`} presetId={activePreset.id} siteTheme={siteTheme} />
        </div>
      </div>
    </div>
  );
}
