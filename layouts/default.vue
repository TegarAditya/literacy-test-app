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

const isUserDataValid = () => {
    const formData: UserData = JSON.parse(local('formData') ?? '');

    return (
        formData.name !== '' &&
        formData.age !== '' &&
        formData.gender !== '' &&
        formData.school !== '' &&
        formData.schoolType !== ''
    );
};

onMounted(async () => {
    isLoading.value = false;

    if (local('formData') === null || local('formData') === undefined || !isUserDataValid()) {
        navigateTo('/');
    } else if (local('sessionData') === null || local('sessionData') === undefined) {
        navigateTo('/otp');
    } else if (local('isFinish') === 'true') {
        navigateTo('/result/beta');
    }
});
</script>
