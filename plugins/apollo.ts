export default defineNuxtPlugin((nuxtApp) => {
  const { apiToken } = useRuntimeConfig();
  nuxtApp.hook("apollo:auth", ({ token }) => {
    token.value = apiToken;
  });
});
