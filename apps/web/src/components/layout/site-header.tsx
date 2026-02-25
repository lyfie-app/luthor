'use client';

import { BookOpen, GithubLogo, House, MoonStars, PlayCircle, RocketLaunch, Sun } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GITHUB_URL } from '@/config/site';

const THEME_STORAGE_KEY = 'luthor-site-theme';

type Theme = 'light' | 'dark';

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const appliedTheme = document.documentElement.dataset.theme;
    const nextTheme =
      appliedTheme === 'dark' || appliedTheme === 'light'
        ? appliedTheme
        : readInitialTheme();
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    setMounted(true);
  }, []);

  useEffect(() => {
    router.prefetch('/');
    router.prefetch('/docs/getting-started/');
    router.prefetch('/docs/getting-started/installation/');
    router.prefetch('/demo/');
  }, [router]);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }

  const isHomeActive = pathname === '/';
  const isDocsActive = pathname.startsWith('/docs');
  const isDemoActive = pathname.startsWith('/demo');

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="Luthor">
          {logoFailed ? (
            <span className="brand-fallback">Luthor</span>
          ) : (
            <Image
              className="brand-logo"
              src="/luthor-logo-horizontal.png"
              alt="Luthor"
              width={360}
              height={70}
              sizes="(max-width: 768px) 180px, 220px"
              priority
              onError={() => setLogoFailed(true)}
            />
          )}
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link href="/" aria-current={isHomeActive ? 'page' : undefined} className={isHomeActive ? 'active' : undefined}>
            <House size={16} weight="duotone" aria-hidden="true" />
            <span>Home</span>
          </Link>          
          <Link href="/#features" className="nav-secondary-link">
            <PlayCircle size={16} weight="duotone" aria-hidden="true" />
            <span>Features</span>
          </Link>          
          <Link href="/demo/" aria-current={isDemoActive ? 'page' : undefined} className={isDemoActive ? 'active' : undefined}>
            <PlayCircle size={16} weight="duotone" aria-hidden="true" />
            <span>Demo</span>
          </Link>    
          <Link
            href="/docs/getting-started/"
            aria-current={isDocsActive ? 'page' : undefined}
            className={isDocsActive ? 'active' : undefined}
          >
            <BookOpen size={16} weight="duotone" aria-hidden="true" />
            <span>Documentation</span>
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GithubLogo size={16} weight="duotone" aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <button
            className={mounted && theme === 'dark' ? 'theme-toggle active' : 'theme-toggle'}
            type="button"
            onClick={toggleTheme}
            aria-pressed={mounted ? theme === 'dark' : undefined}
            aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle color theme'}
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun size={18} weight="duotone" aria-hidden="true" />
              ) : (
                <MoonStars size={18} weight="duotone" aria-hidden="true" />
              )
            ) : (
              <MoonStars size={18} weight="duotone" aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
