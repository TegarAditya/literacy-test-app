import type { Sessions } from '~/types/session';

export const verifiyToken = async (token: string) => {
    const { restApiURL, apiToken } = useRuntimeConfig().public;

    const url = `${restApiURL}/sessions?filters[token][$eq]=${token}`;
    const response = await $fetch<Sessions>(url, {
        method: 'GET',
        headers: {
            Authorization:
                `Bearer ${apiToken}`,
        },
    });

    return response.data;
};
