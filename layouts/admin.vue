<template>
    <div class="absolute z-50 w-full" v-if="!isOnline">
        <div class="w-full flex justify-center items-center">
            <Message severity="error" :closable="false">Tidak ada koneksi internet</Message>
        </div>
    </div>
    <div class="bg-blue-50 dark:bg-gray-900" @contextmenu.prevent>
        <BlockUI :blocked="!isOnline" :auto-z-index="false" :base-z-index="40">
            <slot />
        </BlockUI>
    </div>
</template>

<script lang="ts" setup>
const isOnline = useOnline();
</script>
