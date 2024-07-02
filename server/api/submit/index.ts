export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  return await $fetch(event.path || "/", {
    baseURL: config.restApiURL,
    method: event.method,
    query: getQuery(event),
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
    },
  });
});
