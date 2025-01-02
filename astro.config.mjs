// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from "vite";

const { SITE, WP_REST_API_ENDPOINT } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: SITE,
  env: {
    schema: {
      SITE: envField.string({ context: "server", access: "public", default: 'http://localhost:4321' }),
      WP_REST_API_ENDPOINT: envField.string({ context: "server", access: "public", default: 'https://wordpress.org/news/wp-json' }),
      POSTS_PER_PAGE: envField.number({ context: 'server', access: "public", default: 6 })
    }
  },
  image: {
    domains: [(new URL(WP_REST_API_ENDPOINT)).hostname, 'secure.gravatar.com']
  },
  integrations: [tailwind(), partytown(), sitemap()]
});