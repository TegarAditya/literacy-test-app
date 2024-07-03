<template>
    <div class="flex flex-col w-screen h-screen items-center justify-center dark:bg-gray-900">
        <div class="relative z-10 w-full">
            <Message class="w-fit mx-auto" severity="error" :closable="false" v-if="isIncorrectToken"
                >Mohon maaf, token tidak valid</Message
            >
        </div>
        <Card :class="{ shake: isIncorrectToken }">
            <template #title>
                <p class="text-lg dark:text-white text-center font-bold">Masukkan Token</p>
            </template>
            <template #content>
                <div class="flex flex-col justify-center items-center gap-5">
                    <InputOtp v-model="number" :length="6" integer-only />
                    <div class="text-gray-400 underline">
                        <NuxtLink to="/">Kembali</NuxtLink>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import type { Session } from '~/types/session';

const number: Ref<string> = ref('');
const isIncorrectToken = ref(false);

preloadRouteComponents('/test');

watch(number, async (value) => {
    isIncorrectToken.value = false;

    if (value.length == 6) {
        const verified = await verifiyToken(value);

        if (verified.length > 0) {
            isIncorrectToken.value = false;
            localStorage.setItem('sessionData', JSON.stringify(verified[0]));
            navigateTo('/test');
        } else {
            isIncorrectToken.value = true;
        }
    }
});
</script>

<style scoped>
.shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
}

@keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>
