import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode, isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GITHUB_CONTENT_BASE_URL, SITE_NAME } from '@/config/site';
import { DocsCodeBlock } from '@/features/docs/docs-code-block';
import { getAllDocs, getAllDocSlugs, getDocBySlug } from '@/features/docs/docs.service';

type Params = { slug?: string[] };
type NavGroupId = 'overview' | 'getting_started' | 'luthor_headless' | 'luthor' | 'other';

const NAV_GROUP_ORDER: { id: NavGroupId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'getting_started', label: 'Getting Started' },
  { id: 'luthor_headless', label: 'Luthor Headless - @lyfie/luthor-headless' },
  { id: 'luthor', label: 'Luthor - @lyfie/luthor' },
  { id: 'other', label: 'Other' },
];

function resolveHref(href: string): string {
  if (!href) return '#';
  if (href.endsWith('.md') || href.endsWith('.mdx')) {
    const withoutExt = href.replace(/\.(md|mdx)$/i, '');
    return withoutExt.endsWith('/') ? withoutExt : `${withoutExt}/`;
  }
  return href;
}

function getNavGroupId(urlPath: string): NavGroupId {
  if (urlPath === '/docs/') return 'overview';
  if (urlPath.startsWith('/docs/getting-started/')) return 'getting_started';
  if (urlPath.startsWith('/docs/luthor-headless/')) return 'luthor_headless';
  if (urlPath.startsWith('/docs/luthor/')) return 'luthor';
  return 'other';
}

function buildNavGroups(docs: Awaited<ReturnType<typeof getAllDocs>>) {
  const grouped = new Map<NavGroupId, Awaited<ReturnType<typeof getAllDocs>>>();

  for (const doc of docs) {
    const groupId = getNavGroupId(doc.urlPath);
    const current = grouped.get(groupId) ?? [];
    current.push(doc);
    grouped.set(groupId, current);
  }

  for (const [groupId, entries] of grouped.entries()) {
    if (groupId === 'overview') continue;
    entries.sort((a, b) => a.title.localeCompare(b.title));
    grouped.set(groupId, entries);
  }

  return NAV_GROUP_ORDER.filter((group) => grouped.has(group.id)).map((group) => ({
    ...group,
    entries: grouped.get(group.id)!,
  }));
}

function toDisplayDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.valueOf())) return iso;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(parsed);
}

function extractCodeBlock(children: ReactNode): { code: string; language?: string } | null {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) return null;
  const className = typeof children.props.className === 'string' ? children.props.className : '';
  const languageMatch = className.match(/language-([a-z0-9]+)/i);
  const language = languageMatch?.[1]?.toLowerCase();
  const raw = children.props.children;
  const code = Array.isArray(raw) ? raw.join('') : String(raw ?? '');

  return {
    code: code.replace(/\n$/, ''),
    language,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  const params = slugs.map((slug) => (slug.length ? { slug } : {}));
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];
  const doc = await getDocBySlug(slug);

  if (!doc) {
    return {
      title: 'Documentation Not Found',
      description: 'This documentation page does not exist.',
      robots: { index: false, follow: true },
    };
  }

  return {
    title: doc.title,
    description: doc.description,
    keywords: [doc.title, 'luthor docs', 'react rich text editor docs', 'lexical editor docs'],
    alternates: {
      canonical: doc.urlPath,
    },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url: doc.urlPath,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${doc.title} | ${SITE_NAME}`,
      description: doc.description,
    },
  };
}

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];
  const [doc, allDocs] = await Promise.all([getDocBySlug(slug), getAllDocs()]);

  if (!doc) notFound();
  const navGroups = buildNavGroups(allDocs);
  const orderedDocs = navGroups.flatMap((group) => group.entries);
  const currentIndex = orderedDocs.findIndex((entry) => entry.urlPath === doc.urlPath);
  const previousDoc = currentIndex > 0 ? orderedDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex >= 0 && currentIndex < orderedDocs.length - 1 ? orderedDocs[currentIndex + 1] : null;
  const sourceUrl = `${GITHUB_CONTENT_BASE_URL}/${doc.sourcePath}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.description,
    url: `https://www.luthor.fyi${doc.urlPath}`,
    dateModified: doc.updatedAt,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.luthor.fyi/favicon.svg',
      },
    },
  };

  return (
    <section className="section docs-section">
      <div className="container docs-layout">
        <aside className="docs-sidebar" aria-label="Documentation navigation">
          <h2>Documentation</h2>
          <p className="docs-sidebar-summary">{allDocs.length} public pages</p>
          {navGroups.map((group) => (
            <div className="docs-sidebar-group" key={group.id}>
              <h3>{group.label}</h3>
              <ul>
                {group.entries.map((entry) => {
                  const isCurrent = entry.urlPath === doc.urlPath;
                  return (
                    <li key={entry.urlPath}>
                      <Link href={entry.urlPath} aria-current={isCurrent ? 'page' : undefined} className={isCurrent ? 'active' : ''}>
                        {entry.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>
        <article className="docs-article">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <h1>{doc.title}</h1>
          <p className="docs-meta">
            Last updated {toDisplayDate(doc.updatedAt)}. Source:{' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {doc.sourcePath}
            </a>
            .
          </p>
          <div className="doc-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => {
                  const nextHref = resolveHref(href ?? '#');
                  const isInternal = nextHref.startsWith('/');
                  if (!isInternal) {
                    return (
                      <a href={nextHref} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  }
                  return <Link href={nextHref}>{children}</Link>;
                },
                pre: ({ children }) => {
                  const extracted = extractCodeBlock(children);
                  if (!extracted) return <pre>{children}</pre>;
                  return <DocsCodeBlock code={extracted.code} language={extracted.language} />;
                },
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </div>
          <nav className="docs-pager" aria-label="Documentation pagination">
            <div>
              {previousDoc ? (
                <Link href={previousDoc.urlPath} rel="prev">
                  Previous: {previousDoc.title}
                </Link>
              ) : null}
            </div>
            <div>
              {nextDoc ? (
                <Link href={nextDoc.urlPath} rel="next">
                  Next: {nextDoc.title}
                </Link>
              ) : null}
            </div>
          </nav>
        </article>
      </div>
    </section>
  );
}
