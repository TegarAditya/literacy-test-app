<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const { apiToken } = useRuntimeConfig();

const cookie = useCookie("api-token");

cookie.value = cookie.value || apiToken;
</script>

<style>
@import url('~/assets/css/base.css');
@import url('primeicons/primeicons.css');
</style>