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
import type { UserData } from '~/types/response';

const isOnline = useOnline();
const isLoading = ref(true);
const local = (key: string) => localStorage.getItem(key);

onMounted(async () => {
    const formData: UserData = JSON.parse(local('formData') ?? '');

    console.log(formData)

    isLoading.value = false;
});
</script>
