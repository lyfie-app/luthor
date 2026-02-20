// @ts-check

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Luthor Web',
    }),
    react(),
  ],
  adapter: cloudflare({
     imageService: 'cloudflare'
  }),
});