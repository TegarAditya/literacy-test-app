<script setup lang="ts">

// Define the structure of an answer
interface Answer {
    id: number;
    answer: number | null;
    isCorrect: boolean;
    answerTime: number;
    notSure: boolean;
}

// Use refs to hold the counts for correct and incorrect answers
const correctCount = ref(0);
const incorrectCount = ref(0);

// Fetch answers from local storage and calculate counts
onMounted(() => {
    // Retrieve the stored answers from local storage
    const storedAnswers = localStorage.getItem('answerData');
    if (storedAnswers) {
        // Parse the JSON string back into an array of Answer objects
        const answers = JSON.parse(storedAnswers) as Answer[];

        // Calculate the number of correct and incorrect answers
        correctCount.value = answers.filter(answer => answer.isCorrect).length;
        incorrectCount.value = answers.filter(answer => !answer.isCorrect).length;
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
