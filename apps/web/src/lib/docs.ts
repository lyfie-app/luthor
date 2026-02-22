import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export interface DocEntry {
  slug: string[];
  title: string;
  description: string;
  content: string;
  urlPath: string;
}

const DOCS_ROOT = path.join(process.cwd(), 'src', 'content', 'docs', 'docs');
const MARKDOWN_EXTENSIONS = ['.md', '.mdx'];

function toSlugFromRelativePath(relativePath: string): string[] {
  const normalized = relativePath.replace(/\\/g, '/');
  const withoutExt = normalized.replace(/\.(md|mdx)$/i, '');

  if (withoutExt === 'index') return [];
  if (withoutExt.endsWith('/index')) {
    return withoutExt
      .slice(0, -'/index'.length)
      .split('/')
      .filter(Boolean);
  }

  return withoutExt.split('/').filter(Boolean);
}

function toPathFromSlug(slug: string[]): string {
  return slug.length ? `/docs/${slug.join('/')}/` : '/docs/';
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await readFile(filePath, 'utf8');
    return true;
  } catch {
    return false;
  }
}

function findHeading(content: string): string | null {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch?.[1]?.trim() ?? null;
}

function titleFromSlug(slug: string[]): string {
  const leaf = slug[slug.length - 1] ?? 'Documentation';
  return leaf
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseDoc(raw: string, slug: string[]): DocEntry {
  const { data, content } = matter(raw);
  const title =
    (typeof data.title === 'string' && data.title.trim()) ||
    findHeading(content) ||
    titleFromSlug(slug);
  const description =
    (typeof data.description === 'string' && data.description.trim()) ||
    `Reference documentation for ${title}.`;

  return {
    slug,
    title,
    description,
    content,
    urlPath: toPathFromSlug(slug),
  };
}

function candidateRelativePaths(slug: string[]): string[] {
  if (slug.length === 0) return ['index.md', 'index.mdx'];

  const joined = slug.join('/');
  return [
    `${joined}.md`,
    `${joined}.mdx`,
    `${joined}/index.md`,
    `${joined}/index.mdx`,
  ];
}

export async function getDocBySlug(slug: string[]): Promise<DocEntry | null> {
  for (const relativePath of candidateRelativePaths(slug)) {
    const absolutePath = path.join(DOCS_ROOT, relativePath);
    const exists = await fileExists(absolutePath);
    if (!exists) continue;

    const raw = await readFile(absolutePath, 'utf8');
    return parseDoc(raw, slug);
  }

  return null;
}

async function walkMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await walkMarkdownFiles(fullPath);
      results.push(...nested);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!MARKDOWN_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) continue;
    results.push(fullPath);
  }

  return results;
}

export async function getAllDocs(): Promise<DocEntry[]> {
  const filePaths = await walkMarkdownFiles(DOCS_ROOT);
  const docs = await Promise.all(
    filePaths.map(async (absolutePath) => {
      const relativePath = path.relative(DOCS_ROOT, absolutePath);
      const slug = toSlugFromRelativePath(relativePath);
      const raw = await readFile(absolutePath, 'utf8');
      return parseDoc(raw, slug);
    }),
  );

  return docs.sort((a, b) => a.urlPath.localeCompare(b.urlPath));
}

export async function getAllDocSlugs(): Promise<string[][]> {
  const docs = await getAllDocs();
  return docs.map((doc) => doc.slug);
}
