'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

type SearchDoc = {
  urlPath: string;
  title: string;
  description: string;
  searchableText: string;
};

type SearchResult = {
  doc: SearchDoc;
  score: number;
  snippet: string;
};

type DocsSearchProps = {
  docs: SearchDoc[];
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createSnippet(content: string, query: string): string {
  const clean = content;
  const pattern = new RegExp(escapeRegex(query), 'i');
  const match = pattern.exec(clean);
  if (!match) return clean.slice(0, 180);
  const start = Math.max(0, match.index - 70);
  const end = Math.min(clean.length, match.index + query.length + 110);
  const prefix = start > 0 ? '... ' : '';
  const suffix = end < clean.length ? ' ...' : '';
  return `${prefix}${clean.slice(start, end).trim()}${suffix}`;
}

function scoreDoc(doc: SearchDoc, query: string): number {
  const q = query.toLowerCase();
  const title = doc.title.toLowerCase();
  const description = doc.description.toLowerCase();
  const content = doc.searchableText.toLowerCase();

  let score = 0;
  if (title === q) score += 150;
  if (title.startsWith(q)) score += 110;
  if (title.includes(q)) score += 70;
  if (description.includes(q)) score += 35;
  if (content.includes(q)) score += 12;
  return score;
}

function highlight(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'ig'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={`${part}-${index}`}>{part}</mark> : part,
  );
}

export function DocsSearch({ docs }: DocsSearchProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim();

  const results = useMemo<SearchResult[]>(() => {
    if (normalizedQuery.length < 2) return [];

    return docs
      .map((doc) => {
        const score = scoreDoc(doc, normalizedQuery);
        return score > 0
          ? {
              doc,
              score,
              snippet: createSnippet(doc.searchableText, normalizedQuery),
            }
          : null;
      })
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [docs, normalizedQuery]);

  return (
    <div className="docs-search" role="search">
      <label className="docs-search-label" htmlFor="docs-search-input">Search docs</label>
      <input
        id="docs-search-input"
        className="docs-search-input"
        type="search"
        placeholder="Search by keyword"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {normalizedQuery.length > 0 ? (
        <p className="docs-search-meta">
          {normalizedQuery.length < 2
            ? 'Type at least 2 characters.'
            : `${results.length} result${results.length === 1 ? '' : 's'}`}
        </p>
      ) : null}
      {results.length > 0 ? (
        <ul className="docs-search-results">
          {results.map((result) => (
            <li key={result.doc.urlPath}>
              <Link href={result.doc.urlPath} className="docs-search-link">
                <span className="docs-search-title">{highlight(result.doc.title, normalizedQuery)}</span>
                <span className="docs-search-snippet">{highlight(result.snippet, normalizedQuery)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : normalizedQuery.length >= 2 ? (
        <p className="docs-search-meta">No matches found.</p>
      ) : null}
    </div>
  );
}
