<template>
    <div class="w-full min-h-screen flex flex-col items-center justify-center py-20 px-2">
        <!-- Results Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold">Hasil Test</h1>
        </div>

        <!-- Results Summary -->
        <div class="flex flex-col items-center gap-4">
            <div class="text-2xl font-semibold text-green-500">Jawaban Benar: {{ correctCount }}</div>
            <div class="text-2xl font-semibold text-red-500">Jawaban Salah: {{ incorrectCount }}</div>
        </div>

        <!-- Reset Test -->
        <div>
            <Button label="Ulangi Test" class="mt-8" @click="resetTest" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Data } from '~/types/result';
import { isClient, useStorage } from '@vueuse/core';

useSeoMeta({
    title: 'Hasil Test',
    description: 'Hasil test yang telah kamu kerjakan',
});

const correctCount = ref(0);
const incorrectCount = ref(0);

let answers: any[] = [];
onMounted(async () => {
    const storedAnswers = localStorage.getItem('answers');
    const answersObject = storedAnswers ? JSON.parse(storedAnswers) : {};
    if (answersObject) {
        answers = answersObject.data.map((entry: { option_code: string }) => entry.option_code);
    }

    const query = gql`
        query {
            options(filters: { is_correct: { eq: true } }, pagination: { limit: 35 }, sort: "code") {
                data {
                    id
                    attributes {
                        code
                    }
                }
            }
        }
    `;
    const { onResult } = useQuery<Data>(query);

    let correctOptions: string[] = [];

    onResult((value) => {
        correctOptions = value?.data?.options.data.map((option) => option.attributes.code) ?? [];

        correctCount.value = answers.filter((answer) => correctOptions.includes(answer)).length;

        incorrectCount.value = answers.length - correctCount.value;
    });
});

async function resetTest() {
    localStorage.removeItem('answers');
    localStorage.removeItem('formData');
    localStorage.removeItem('isFinish');
    localStorage.removeItem('target');
    localStorage.removeItem('targetDate');
    localStorage.removeItem('sessionData');
    localStorage.removeItem('stems');

    await navigateTo('/');
}
</script>
