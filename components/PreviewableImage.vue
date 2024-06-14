<script setup lang="ts">
defineProps<{
    src: string;
    alt: string;
    preview: boolean;
}>()
</script>

<template>
    <div class="flex flex-col justify-center items-center gap-3">
        <Image :alt="alt" preview>
            <template #indicatoricon>
                <i class="pi pi-search"></i>
            </template>
            <template #image>
                <img :src="src" alt="image" />
            </template>
            <template #preview="slotProps">
                <img :src="src" alt="preview" :style="slotProps.style" @click="slotProps.previewCallback" />
                <div>
                    <p class="mx-2 lg:text-lg text-center italic text-white absolute bottom-10">{{ alt }}</p>
                </div>
            </template>
        </Image>
        <p class="text-sm italic text-gray-500">{{ alt }}</p>
    </div>
</template>