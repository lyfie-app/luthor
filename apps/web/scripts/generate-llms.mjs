import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WEB_ROOT = process.cwd();
const REPO_ROOT = path.resolve(WEB_ROOT, '..', '..');
const SOURCE_DOCS_DIR = path.join(REPO_ROOT, 'documentation');
const PUBLIC_DIR = path.join(WEB_ROOT, 'public');
const LLMS_FILE = path.join(PUBLIC_DIR, 'llms.txt');
const LLMS_FULL_FILE = path.join(PUBLIC_DIR, 'llms-full.txt');

const SITE_URL = 'https://www.luthor.fyi';

function isMarkdownFile(filename) {
  return filename.endsWith('.md') || filename.endsWith('.mdx');
}

async function* walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
      continue;
    }
    if (!entry.isFile() || !isMarkdownFile(entry.name)) continue;
    yield fullPath;
  }
}

function docsUrlFromRelativePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  const withoutExt = normalized.replace(/\.(md|mdx)$/i, '');
  return `${SITE_URL}/docs/reference/${withoutExt.replace(/\\/g, '/')}/`;
}

function sectionLabel(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized.startsWith('user/')) return 'User Docs';
  if (normalized.startsWith('developer/')) return 'Developer Docs';
  if (normalized.startsWith('readmes/')) return 'Readmes';
  if (normalized.startsWith('tutorials/')) return 'Tutorials';
  return 'General';
}

async function buildLlmsArtifacts() {
  const docs = [];
  for await (const filePath of walkFiles(SOURCE_DOCS_DIR)) {
    const relativePath = path.relative(SOURCE_DOCS_DIR, filePath);
    const raw = await readFile(filePath, 'utf8');
    docs.push({ relativePath, raw });
  }

  docs.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const grouped = new Map();
  for (const doc of docs) {
    const label = sectionLabel(doc.relativePath);
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(doc);
  }

  const tocLines = [
    '# Luthor LLM Index',
    '',
    'This file helps AI agents discover Luthor docs quickly.',
    '',
    `- Site: ${SITE_URL}`,
    `- Demo: ${SITE_URL}/demo/`,
    `- Docs home: ${SITE_URL}/docs/`,
    `- Full corpus: ${SITE_URL}/llms-full.txt`,
    `- Sitemap: ${SITE_URL}/sitemap-index.xml`,
    '',
    '## Documentation Table of Contents',
    '',
  ];

  for (const [label, items] of grouped.entries()) {
    tocLines.push(`### ${label}`);
    for (const item of items) {
      const url = docsUrlFromRelativePath(item.relativePath);
      const normalizedPath = item.relativePath.replace(/\\/g, '/');
      tocLines.push(`- [${normalizedPath}](${url})`);
    }
    tocLines.push('');
  }

  const fullLines = [
    '# Luthor Documentation Full Corpus',
    '',
    'Concatenated markdown corpus for AI ingestion.',
    '',
    `Source root: ${SOURCE_DOCS_DIR}`,
    `Generated at: ${new Date().toISOString()}`,
    '',
  ];

  for (const item of docs) {
    fullLines.push('---');
    fullLines.push(`## FILE: ${item.relativePath.replace(/\\/g, '/')}`);
    fullLines.push(`## URL: ${docsUrlFromRelativePath(item.relativePath)}`);
    fullLines.push('---');
    fullLines.push('');
    fullLines.push(item.raw.trim());
    fullLines.push('');
  }

  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(LLMS_FILE, `${tocLines.join('\n')}\n`, 'utf8');
  await writeFile(LLMS_FULL_FILE, `${fullLines.join('\n')}\n`, 'utf8');

  console.log(`Generated llms artifacts for ${docs.length} documentation files`);
}

buildLlmsArtifacts().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
