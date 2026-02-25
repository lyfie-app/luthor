'use client';

import { ExtensiveEditor } from '@lyfie/luthor';

type Theme = 'light' | 'dark';

type ExtensiveEditorClientProps = {
  siteTheme?: Theme;
};

export function ExtensiveEditorClient({ siteTheme }: ExtensiveEditorClientProps) {
  return <ExtensiveEditor 
  initialTheme={siteTheme}
  toolbarAlignment='center'
   />;
}
