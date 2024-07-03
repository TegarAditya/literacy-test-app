<template>
    <div class="w-full px-2 flex justify-center items-center h-screen z-30" v-show="true">
        <Guide @trigger="startTest"/>
    </div>
</template>

<script setup lang="ts">
import { isClient } from '@vueuse/core';

useSeoMeta({
    title: 'Panduan Pengerjaan',
    description: 'Panduan pengerjaan soal ujian',
});

const { isFullscreen, toggle } = useFullscreen();

preloadRouteComponents('/test/app');

async function startTest() {
    if (isClient) {
        localStorage.removeItem('answers');
    }

    await navigateTo('/test/appBeta');

    if (!isFullscreen.value) {
        toggle();
    }
}
</script>
