import type { Metadata } from 'next';
import { PresetShowcaseShell } from '@/features/editor/preset-showcase-shell';

export const metadata: Metadata = {
  title: 'Luthor Demo Playground',
  description: 'Explore every Luthor preset live, switch instantly, and evaluate the right React + Lexical editing experience before integrating.',
  keywords: ['luthor demo', 'react rich text editor demo', 'lexical editor demo', 'luthor presets'],
  alternates: {
    canonical: '/demo/',
  },
};

export default function DemoPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="hero-title demo-title">Demo playground</h1>
        <p className="section-copy">Browse every preset from one place and preview each in a full interactive editor.</p>
        <PresetShowcaseShell />
      </div>
    </section>
  );
}
