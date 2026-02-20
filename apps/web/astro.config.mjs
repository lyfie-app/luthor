// @ts-check

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://luthor.lyfie.app',
  integrations: [
    starlight({
      title: 'Luthor Docs',
      description: 'Documentation for @lyfie/luthor and @lyfie/luthor-headless.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/lyfie-app/luthor' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', link: '/docs/' },
            { label: '@lyfie/luthor', link: '/docs/getting-started/' },
          ],
        },
        {
          label: 'Headless Usage',
          items: [
            { label: '@lyfie/luthor-headless', link: '/docs/headless-usage/' },
          ],
        },
        {
          label: 'UI Components',
          items: [
            { label: 'Extensive Editor', link: '/docs/ui-components/' },
          ],
        },
        {
          label: 'Presets',
          items: [
            { label: 'Presets and Configuration', link: '/docs/presets/' },
            { label: 'Reference Mirror', link: '/docs/reference/' },
          ],
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/lyfie-app/luthor/tree/main/apps/web/',
      },
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://luthor.lyfie.app/social-card.svg',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://luthor.lyfie.app/social-card.svg',
          },
        },
      ],
      pagefind: true,
      customCss: ['./src/styles/global.css'],
    }),
    react(),
  ],
  adapter: cloudflare({
     imageService: 'cloudflare'
  }),
  vite: {
    ssr: {
      external: ['node:fs/promises', 'node:path', 'node:url', 'node:crypto'],
    },
    build: {
      chunkSizeWarningLimit: 900,
    },
  },
});
