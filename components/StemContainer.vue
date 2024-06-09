<script setup lang="ts">

const confirm = useConfirm();

interface Question {
    id: number;
    question: string;
    options: string[];
    answer: number | null;
    time: number;
    active: boolean;
    correctAnswer: number;
    notSure: boolean;
}

interface Answer {
    id: number;
    answer: number | null;
    answerTime: number;
    notSure: boolean;
}

const { storedValue: storedAnswers, setValue: updateStoredAnswers } = useLocalStorage('answerData', []);
const questions = ref<Question[]>([
    {
        id: 1,
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        answer: null,
        time: 0,
        active: false,
        correctAnswer: 0,
        notSure: false,
    },
    {
        id: 2,
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        answer: null,
        time: 0,
        active: false,
        correctAnswer: 1,
        notSure: false,
    },
    {
        id: 3,
        question: 'What is 2 + 1?',
        options: ['3', '4', '5', '6'],
        answer: null,
        time: 0,
        active: false,
        correctAnswer: 0,
        notSure: false,
    },
]);

const answers = ref<Answer[]>(storedAnswers.value || []);

onMounted(() => {
    if (storedAnswers.value.length > 0) {
        storedAnswers.value.forEach((storedAnswer: Answer) => {
            const question = questions.value.find(q => q.id === storedAnswer.id);
            if (question) {
                question.answer = storedAnswer.answer;
                question.notSure = storedAnswer.notSure;
            }
        });
    }
});

const hasNotSureQuestions = () => {
    return questions.value.some(question => question.notSure);
};

const confirmSubmit = () => {
    const confirmationMessage = hasNotSureQuestions()
        ? 'Beberapa pertanyaan ditandai sebagai “Ragu-ragu”. Apakah Anda yakin ingin mengirimkannya? Anda tidak dapat mengubah jawaban Anda setelahnya.'
        : 'Apakah Anda yakin ingin mengirimkan tes ini? Anda tidak dapat mengubah jawaban Anda setelahnya.';

    confirm.require({
        group: 'templating',
        header: 'Konfirmasi Submit',
        message: confirmationMessage,
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Ya',
        rejectLabel: 'Tidak',
        //@ts-ignore
        rejectProps: {
            label: 'Cancel',
            icon: 'pi pi-times',
            outlined: true,
            severity: 'secondary',
            size: 'small'
        },
        acceptProps: {
            label: 'Save',
            icon: 'pi pi-check',
            size: 'small'
        },
        accept: () => {
            submitAnswers();
            // @ts-ignore
            navigateTo('/result');
        },
        reject: () => {
            // Do nothing
        }
    });
};

const submitAnswers = () => {
    answers.value = questions.value.map(q => ({
        id: q.id,
        answer: q.answer,
        isCorrect: q.answer === q.correctAnswer,
        answerTime: q.time,
        notSure: q.notSure
    }));
    console.log('Submitted answers:', answers.value);
    updateStoredAnswers(answers.value); // Save answers to local storage
};

watch(questions, (newQuestions) => {
    // Update local storage when questions change, including notSure state
    const updatedAnswers = newQuestions.map(q => ({
        id: q.id,
        answer: q.answer,
        isCorrect: q.answer === q.correctAnswer,
        answerTime: q.time,
        notSure: q.notSure
    }));
    updateStoredAnswers(updatedAnswers);
}, { deep: true });

</script>

<template>
    <!-- Main Header -->
    <div class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 top-0 flex justify-center items-center">
        <div class="bg-white p-2 min-w-40 rounded-full shadow-inner">
            <p class="dark:text-white text-center font-bold">Test</p>
        </div>
    </div>

    <!-- Main content area -->
    <div class="w-full min-h-screen flex flex-col items-center gap-4 py-20 px-2">
        <!-- Single Stem Panel -->
        <div class="flex flex-col gap-4 lg:flex-row lg:justify-around lg:w-[1000px]">
            <!-- Stem Text -->
            <div class="p-5 w-full border-2 rounded-lg h-fit dark:text-white bg-white">
                <p class="text-lg font-bold">STEM 1</p>
                <hr class="my-2">
                <ScrollPanel class="h-56 lg:w-[300px] lg:h-80 lg:max-h-80" style="width: 100%;">
                    <div class="w-full pr-2 gap-4 flex flex-col lg:mr-0 pb-10">
                        <p>Baterai menggunakan energi dari reaksi kimia untuk memisahkan muatan negatif dan positif di
                            dalam
                            baterai. Proses ini menghasilkan peningkatan energi potensial elektrostatik (muatan listrik
                            diam) dari muatan yang mengarah ke perbedaan tegangan. Baterai senter yang biasa ditemui
                            memiliki beda potensial 1,5 volt di antara kedua terminal (kutub posiif dan negatif
                            baterai).
                        </p>
                        <p>
                            Karena ada kelebihan muatan positif di salah satu terminal baterai dan kelebihan muatan
                            negatif
                            di terminal baterai yang lain, muatan ini akan cenderung bergabung kembali dengan mengalir
                            dari
                            satu terminal ke terminal yang lain jika terdapat penghantar antara kedua terminal.
                            Muatan-muatan ini hanya dapat mengalir melalui penghantar eksternal. Namun karena adanya
                            gaya
                            yang berlawanan terkait dengan reaksi kimia dalam baterai, muatan akan mengalir melalui
                            penghubung ke terminal yang berlawanan.
                        </p>
                        <p>
                            Satuan internasional (SI) untuk arus listrik adalah Ampere (A), yang didefinisikan sebagai 1
                            coulomb per detik, sedangkan coulomb dapat dimaknai sebagai banyaknya muatan. Satuan ampere
                            diambil dari nama penemunya yang seorang ahli mmatematika dan fisika bernama Prancis Andre
                            Marie
                            Ampere tahung 1775-1836.
                        </p>
                        <Image src="/images/Picture1.png" class="items-center" preview alt="PrimeVue Logo" />
                    </div>
                    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
                </ScrollPanel>
            </div>

            <!-- Questions with Options -->
            <div class="border-2 rounded-lg overflow-hidden w-full h-fit">
                <Accordion :activeIndex="null">
                    <AccordionTab v-for="(question, index) in questions" :key="question.id">
                        <template #header>
                            <span class="flex items-center gap-2 w-full">
                                <span class="font-bold white-space-nowrap">Soal {{ index + 1 }}</span>
                                <Badge value="Ragu-ragu" class="ml-auto px-2 mr-2" severity="danger"
                                    v-show="question.notSure" />
                            </span>
                        </template>
                        <p class="m-0">{{ question.question }}</p>
                        <div class="py-5 flex flex-col gap-2">
                            <div class="flex items-center bg-gray-50 p-2 rounded-md"
                                @click="() => { question.answer = i; submitAnswers(); }"
                                v-for="(option, i) in question.options" :key="i">
                                <RadioButton :inputId="`option-${question.id}-${i}`" :name="'question-' + question.id"
                                    :value="i" v-model="question.answer" />
                                <label :for="`option-${question.id}-${i}`" class="ml-2">{{ option }}</label>
                            </div>
                        </div>
                        <div class="bg-yellow-100 flex items-center justify-center p-1 rounded-lg"
                            @click="() => { question.notSure = !question.notSure; submitAnswers(); }">
                            <div class="space-x-2 flex items-center">
                                <Checkbox :inputId="`notSure-${question.id}`" v-model="question.notSure"
                                    :binary="true" />
                                <label :for="`notSure-${question.id}`" class="min-w-full">Tandai sebagai
                                    ragu-ragu</label>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>
        </div>

        <!-- Confirm Dialog -->
        <ConfirmDialog group="templating" class="w-full mx-4 max-w-2xl">
            <template #message="slotProps">
                <div
                    class="flex flex-col w-full items-center gap-3 border-b border-surface-200 dark:border-surface-700">
                    <i :class="slotProps.message.icon" class="text-6xl text-primary"></i>
                    <p class="pb-3 text-center">{{ slotProps.message.message }}</p>
                </div>
            </template>
        </ConfirmDialog>

        <!-- Navigation Buttons -->
        <div class="w-full h-14 bg-blue-400 dark:bg-black fixed z-10 bottom-0 flex justify-center items-center gap-4">
            <Button :severity="'secondary'" icon="pi pi-angle-left" label="Previous" :disabled="true" raised rounded />
            <Button :severity="'secondary'" icon="pi pi-angle-right" iconPos="right" label="Next" :disabled="true"
                raised rounded />
            <Button :severity="'success'" label="Submit" @click="confirmSubmit" raised rounded />
        </div>
    </div>
</template>
