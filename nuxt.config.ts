import path from "path";
import tailwindTypography from "@tailwindcss/typography";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    apiURL: process.env.API_ENDPOINT,
    apiToken: process.env.API_TOKEN,
    restApiURL: process.env.REST_API_ENDPOINT,
    public: {
      apiToken: process.env.API_TOKEN,
      restApiURL: process.env.REST_API_ENDPOINT,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@nuxt/image",
    "@nuxtjs/strapi",
    "@nuxtjs/apollo",
    "@vueuse/nuxt",
  ],
  primevue: {
    options: {
      unstyled: true,
      ripple: true,
    },
    importPT: { from: path.resolve(__dirname, "presets/aura/") },
  },
  tailwindcss: {
    configPath: "tailwind.config.js",
  },
  strapi: {
    version: "v4",
    prefix: "/api",
    admin: "/admin",
    devtools: true,
    url: "http://localhost:1337",
  },
  apollo: {
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    clients: {
      default: {
        httpEndpoint:
          process.env.API_ENDPOINT || "http://localhost:1337/graphql",
        tokenName: "api-token",
      },
    },
  },
});
