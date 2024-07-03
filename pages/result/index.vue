<script setup lang="ts">
interface Answer {
    id: number;
    answer: number | null;
    isCorrect: boolean;
    answerTime: number;
    notSure: boolean;
}

const correctCount = ref(0);
const incorrectCount = ref(0);

onMounted(() => {
    const storedAnswers = localStorage.getItem('answerData');
    if (storedAnswers) {
        const answers = JSON.parse(storedAnswers) as Answer[];

        correctCount.value = answers.filter((answer) => answer.isCorrect).length;
        incorrectCount.value = answers.filter((answer) => !answer.isCorrect).length;
    }
});
</script>

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
    </div>
</template>
