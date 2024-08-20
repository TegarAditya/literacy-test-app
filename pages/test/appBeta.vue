<template>
    <ClientOnly>
        <StemContainerApi />
    </ClientOnly>
</template>

<script lang="ts" setup>
useHead({
    title: 'Testlet Beta',
    meta: [
        {
            name: 'description',
            content: 'Halaman Test',
        },
    ],
});
</script>
