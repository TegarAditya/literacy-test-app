import type { Responses } from "~/types/response";

export async function getResponseData(): Promise<Responses> {
  const config = useRuntimeConfig();
  return await fetch(config.restApiURL).then((response) => response.json());
}
