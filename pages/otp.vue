<script setup lang="ts">

const corectOtp = '123456';
const number: Ref<string> = ref('');
const isIncorrectOtp = ref(false);

const { data: time } = await useFetch('http://worldtimeapi.org/api/timezone/Asia/Jakarta');

watch(number, (value) => {
    if (value === corectOtp && value.length === 6) {
        isIncorrectOtp.value = false;
        // @ts-ignore
        navigateTo('/test')
    } else if (value?.toString().length === 6) {
        isIncorrectOtp.value = true;
    }
});
</script>

<template>
    <div class="flex flex-col w-screen h-screen items-center justify-center dark:bg-gray-900">
        <Card>
            <template #title>
                <p class="text-lg dark:text-white text-center font-bold">Masukkan Token</p>
            </template>
            <template #content>
                <div class="flex flex-col justify-center items-center gap-5">
                    <p class="text-red-400 mx-3 text-center" v-if="isIncorrectOtp">Mohon maaf, token tidak valid</p>
                    <InputOtp v-model="number" :length="6" integer-only/>
                    <div class="text-gray-400 underline">
                        <NuxtLink to="/">Kembali</NuxtLink>
                    </div>
                </div>

            </template>
        </Card>
    </div>
</template>
