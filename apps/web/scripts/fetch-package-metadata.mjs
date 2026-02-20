import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WEB_ROOT = process.cwd();
const OUTPUT_FILE = path.join(WEB_ROOT, 'src', 'data', 'package-metadata.json');

const npmPackage = '@lyfie/luthor';
const githubRepo = 'lyfie-app/luthor';
const metadataSource = {
  downloads: `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(npmPackage)}`,
  registry: `https://registry.npmjs.org/${encodeURIComponent(npmPackage)}`,
  bundlephobia: `https://bundlephobia.com/api/size?package=${encodeURIComponent(npmPackage)}`,
  github: `https://api.github.com/repos/${githubRepo}`,
};

const fallbackMetadata = {
  packageName: npmPackage,
  npmUrl: 'https://www.npmjs.com/package/@lyfie/luthor',
  githubUrl: 'https://github.com/lyfie-app/luthor',
  sponsorsUrl: 'https://github.com/sponsors/lyfie-app',
  metrics: {
    weeklyDownloads: null,
    latestVersion: null,
    minzippedSizeBytes: null,
    githubStars: null,
  },
  fetchedAt: new Date(0).toISOString(),
  partial: true,
};

async function safeFetchJson(url) {
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json', 'user-agent': 'luthor-web-metadata-fetcher' },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function readExistingMetadata() {
  try {
    const raw = await readFile(OUTPUT_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeMetadataFile(metadata) {
  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
}

async function fetchMetadata() {
  const [downloads, registry, bundle, github] = await Promise.all([
    safeFetchJson(metadataSource.downloads),
    safeFetchJson(metadataSource.registry),
    safeFetchJson(metadataSource.bundlephobia),
    safeFetchJson(metadataSource.github),
  ]);

  const nextMetadata = {
    packageName: npmPackage,
    npmUrl: 'https://www.npmjs.com/package/@lyfie/luthor',
    githubUrl: 'https://github.com/lyfie-app/luthor',
    sponsorsUrl: 'https://github.com/sponsors/lyfie-app',
    metrics: {
      weeklyDownloads: typeof downloads?.downloads === 'number' ? downloads.downloads : null,
      latestVersion: registry?.['dist-tags']?.latest ?? null,
      minzippedSizeBytes: typeof bundle?.gzip === 'number' ? bundle.gzip : null,
      githubStars: typeof github?.stargazers_count === 'number' ? github.stargazers_count : null,
    },
    fetchedAt: new Date().toISOString(),
    partial: !downloads || !registry || !bundle || !github,
  };

  const hasAnyMetric = Object.values(nextMetadata.metrics).some((value) => value !== null);
  if (hasAnyMetric) {
    await writeMetadataFile(nextMetadata);
    console.log(`Fetched package metadata (${nextMetadata.partial ? 'partial' : 'complete'})`);
    return;
  }

  const existing = await readExistingMetadata();
  if (existing) {
    console.log('All live metadata requests failed, keeping existing metadata snapshot');
    return;
  }

  await writeMetadataFile({ ...fallbackMetadata, fetchedAt: new Date().toISOString() });
  console.log('All live metadata requests failed, wrote fallback metadata');
}

fetchMetadata().catch(async (error) => {
  console.error(error);
  const existing = await readExistingMetadata();
  if (existing) process.exitCode = 0;
  else process.exitCode = 1;
});
