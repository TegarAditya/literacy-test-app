export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  nuxtApp.hook("apollo:auth", ({ token }) => {
    token.value = config.public.apiToken;
  });
});
