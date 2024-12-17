// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from "vite";

const { SITE } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: SITE,
  env: {
    schema: {
      SITE: envField.string({ context: "server", access: "public", default: 'http://localhost:4321' })
    }
  },
  integrations: [tailwind(), partytown(), sitemap()]
});