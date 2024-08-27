<template>
    <div v-if="shuffledStems">
        <ScrollPanel class="w-full h-[100dvh]" :pt="scrollPanelOptions">
            <div class="fixed w-full h-screen z-50 flex justify-center items-center" v-show="isGuideEnabled">
                <Guide @trigger="isGuideEnabled = !isGuideEnabled" />
            </div>
            <div class="fixed w-full h-screen z-50 flex justify-center items-center" v-show="isNavigationEnabled">
                <StemNavigationWrapper @trigger="isNavigationEnabled = !isNavigationEnabled">
                    <div class="mr-3">
                        <div v-for="(stem, sIndex) in shuffledStems">
                            <Divider>
                                <span class="text-sm font-bold">Bacaan {{ sIndex + 1 }}</span>
                            </Divider>
                            <div class="flex justify-center gap-3 items-center">
                                <div v-for="(question, qIndex) in stem.attributes.questions.data">
                                    <Button
                                        @click="navigateToIndex(sIndex)"
                                        :key="`${stem.id}-flagged`"
                                        severity="warning"
                                        rounded
                                        v-if="isQuestionNotSure(question.attributes.code)"
                                    >
                                        <div class="aspect-square">
                                            {{ qIndex + 1 }}
                                        </div>
                                    </Button>
                                    <Button
                                        @click="navigateToIndex(sIndex)"
                                        :key="`${stem.id}-answered`"
                                        severity="success"
                                        rounded
                                        v-else-if="isQuestionAnswered(question.attributes.code)"
                                    >
                                        <div class="aspect-square">
                                            {{ qIndex + 1 }}
                                        </div>
                                    </Button>
                                    <Button
                                        @click="navigateToIndex(sIndex)"
                                        :key="stem.id"
                                        severity="secondary"
                                        rounded
                                        v-else
                                    >
                                        <div class="aspect-square">
                                            {{ qIndex + 1 }}
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </StemNavigationWrapper>
            </div>
            <BlockUI :blocked="blocked" :auto-z-index="true" class="z-30">
                <div class="w-full min-h-screen flex flex-col items-center py-20 px-2">
                    <div v-for="(stem, stemIndex) in shuffledStems" :key="stem.id">
                        <!-- Single Stem Panel -->
                        <div
                            class="flex flex-col gap-4 lg:flex-row lg:justify-around md:mx-12 lg:w-[1200px]"
                            v-show="page == stemIndex"
                        >
                            <!-- Stem Text -->
                            <div class="p-5 w-full border-2 rounded-lg h-fit dark:text-white bg-white dark:bg-zinc-900">
                                <p class="text-lg font-bold">Bacaan {{ stemIndex + 1 }}</p>
                                <hr class="my-2" />
                                <ScrollPanel
                                    class="h-72 md:h-96 md:max-h-96 lg:w-[300px] lg:min-h-[65dvh]"
                                    style="width: 100%"
                                >
                                    <div
                                        class="stem w-full pr-4 gap-3 flex flex-col lg:mr-0 pb-10 list-inside"
                                        v-html="stem.attributes.stem_field"
                                    ></div>
                                    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
                                </ScrollPanel>
                            </div>

                            <!-- Questions with Options -->
                            <div class="border-2 rounded-lg overflow-hidden w-full h-fit">
                                <Accordion :activeIndex="null">
                                    <AccordionTab
                                        v-for="(question, questionIndex) in stem.attributes.questions.data"
                                        :key="question.id"
                                        @click="updateActiveQuestion(question.attributes.code)"
                                    >
                                        <template #header>
                                            <span class="flex items-center gap-2 w-full">
                                                <span class="font-bold white-space-nowrap"
                                                    >Soal {{ questionIndex + 1 }}</span
                                                >
                                                <span>{{
                                                    // formatDuration(
                                                    //   getAnswerForQuestion(question.attributes.code)
                                                    //     ?.duration || 0
                                                    // )
                                                    activeQuestion?.attributes.code
                                                }}</span>
                                                <Badge
                                                    v-if="isQuestionNotSure(question.attributes.code)"
                                                    value="Ragu-ragu"
                                                    class="ml-auto px-2 mr-2"
                                                    severity="danger"
                                                />
                                            </span>
                                        </template>
                                        <div class="question m-0" v-html="question.attributes.question_field"></div>
                                        <div class="py-5 flex flex-col gap-2">
                                            <div
                                                class="flex items-center bg-gray-50 dark:bg-zinc-800 p-2 rounded-md"
                                                v-for="option in question.attributes.options.data"
                                                :key="option.attributes.code"
                                                @click="
                                                    getAnswerForQuestion(question.attributes.code).option_code =
                                                        option.attributes.code
                                                "
                                            >
                                                <RadioButton
                                                    :inputId="option.attributes.code"
                                                    :name="`question-${question.attributes.code}`"
                                                    :value="option.attributes.code"
                                                    v-model="getAnswerForQuestion(question.attributes.code).option_code"
                                                />
                                                <label
                                                    :for="option.attributes.code"
                                                    class="option ml-2"
                                                    v-html="option.attributes.option"
                                                ></label>
                                            </div>
                                        </div>
                                        <div
                                            class="bg-yellow-100 dark:bg-zinc-700 flex items-center justify-center p-1 rounded-lg"
                                        >
                                            <div class="space-x-2 flex items-center">
                                                <Checkbox
                                                    :inputId="`notSure-${question.id}`"
                                                    :binary="true"
                                                    v-model="getAnswerForQuestion(question.attributes.code).isNotSure"
                                                />
                                                <label :for="`notSure-${question.id}`" class="min-w-full"
                                                    >Tandai sebagai ragu-ragu</label
                                                >
                                            </div>
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUI>
        </ScrollPanel>
    </div>

    <!-- Loading Spinner -->
    <div class="w-full min-h-screen flex justify-center items-center" v-else>
        <ProgressSpinner aria-label="Loading" />
    </div>

    <!-- Main Header -->
    <div class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 top-0 flex justify-center items-center">
        <div class="bg-white p-2 min-w-40 rounded-full shadow-inner">
            <p class="dark:text-white text-center font-bold">
                <Countdown />
            </p>
        </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog group="templating" class="w-full mx-4 max-w-2xl">
        <template #message="slotProps">
            <div class="flex flex-col w-full items-center gap-3 border-b border-surface-200 dark:border-surface-700">
                <i :class="slotProps.message.icon" class="text-6xl text-primary"></i>
                <p class="pb-3 text-center">{{ slotProps.message.message }}</p>
            </div>
        </template>
    </ConfirmDialog>

    <!-- Navigation Buttons Full -->
    <div
        class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 bottom-0 md:flex justify-center items-center gap-1 md:gap-4 hidden"
    >
        <Button :severity="'help'" icon="pi pi-info-circle" @click="isGuideEnabled = !isGuideEnabled" rounded />
        <Button :severity="'info'" icon="pi pi-th-large" @click="isNavigationEnabled = !isNavigationEnabled" rounded />
        <Button
            :severity="'secondary'"
            icon="pi pi-angle-left"
            label="Previous"
            :disabled="page == 0"
            @click="prevPage"
            raised
            rounded
        />
        <Button
            :severity="'secondary'"
            icon="pi pi-angle-right"
            iconPos="right"
            label="Next"
            :disabled="page + 1 == shuffledStems.length"
            @click="nextPage"
            raised
            rounded
        />
        <div
            v-tooltip.top="{
                value: 'Dibuka saat 5 menit terakhir',
                showDelay: 200,
                hideDelay: 200,
            }"
        >
            <Button
                :severity="'success'"
                label="Submit"
                @click="confirmSubmit"
                :disabled="!enableSubmit"
                raised
                rounded
            />
        </div>
    </div>

    <!-- Navigation Buttons Small -->
    <div
        class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 bottom-0 flex justify-center items-center gap-2 md:gap-4 md:hidden"
    >
        <Button :severity="'help'" icon="pi pi-info-circle" @click="isGuideEnabled = !isGuideEnabled" rounded />
        <Button :severity="'info'" icon="pi pi-th-large" @click="isNavigationEnabled = !isNavigationEnabled" rounded />
        <Button
            :severity="'secondary'"
            icon="pi pi-angle-left"
            aria-label="Previous"
            :disabled="!hasPreviousPage"
            @click="prevPage"
            raised
            rounded
        />
        <Button
            :severity="'secondary'"
            icon="pi pi-angle-right"
            iconPos="right"
            aria-label="Next"
            :disabled="!hasNextPage"
            @click="nextPage"
            raised
            rounded
        />
        <Button
            :severity="'success'"
            label="Submit"
            @click="submitAnswers"
            :disabled="!enableSubmit"
            v-tooltip="{
                value: 'Dibuka saat 5 menit terakhir',
                showDelay: 300,
                hideDelay: 300,
            }"
            raised
            rounded
        />
    </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core';

import type { ScrollPanelPassThroughOptions } from 'primevue/scrollpanel';
import type { PassThrough } from 'primevue/ts-helpers';
import type { Answer, Answers, Data, Question, Stem } from '~/types/stem';

const config = useRuntimeConfig();
const router = useRouter();

const time = useState('remaining_time');
const confirm = useConfirm();

const enableSubmit = ref(false);

watch(time, (time) => {
    if (typeof time === 'string') {
        const timeInSeconds = timeStringToSeconds(time);

        if (timeInSeconds === timeStringToSeconds('00:00:00')) {
            if (localStorage.getItem('isFinish') === null) {
                submitAnswers();
            } else {
                router.push('/result/beta');
            }
        }

        if (timeInSeconds <= timeStringToSeconds('00:05:00')) {
            enableSubmit.value = true;
        }
    } else {
        console.error('Unexpected type for time:', typeof time);
    }
});

const isSubmitting = ref(false);

const query = gql`
    query getStems {
        stems {
            data {
                id
                attributes {
                    name
                    stem_field
                    questions {
                        data {
                            id
                            attributes {
                                code
                                order
                                question_field
                                options {
                                    data {
                                        attributes {
                                            option
                                            code
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            meta {
                pagination {
                    total
                }
            }
        }
    }
`;

const { data } = await useAsyncQuery<Data>(query);

const useStems = useStorage<Stem[]>('stems', []);

const shuffledStems = computed(() => {
    if (useStems.value.length === 0) {
        if (data.value) {
            useStems.value = shuffle([...data.value.stems.data]);
        }
    }
    return useStems.value;
});

const answers = ref<Answers>({ data: [] });

watch(
    shuffledStems,
    (newStems) => {
        if (newStems.length) {
            const initialAnswers: Answer[] = [];
            newStems.forEach((stem) => {
                stem.attributes.questions.data.forEach((question) => {
                    initialAnswers.push({
                        question_code: question.attributes.code,
                        option_code: null,
                        isNotSure: false,
                        duration: 0,
                    });
                });
            });
            answers.value = { data: initialAnswers };
        }
    },
    { immediate: true }
);

const savedAnswers = useStorage('answers', answers.value);

watch(
    answers,
    () => {
        savedAnswers.value = answers.value;
    },
    { deep: true }
);

onMounted(() => {
    if (savedAnswers.value) {
        answers.value = savedAnswers.value;
    }

    setInterval(() => {
        if (activeQuestion.value) {
            const activeAnswer = getAnswerForQuestion(activeQuestion.value.attributes.code);
            if (activeAnswer) {
                activeAnswer.duration = (activeAnswer.duration || 0) + 1;
            }
        }
    }, 1000);
});

const scrollPanelOptions: PassThrough<ScrollPanelPassThroughOptions> = {
    wrapper: {
        style: { 'border-right': 'none' },
    },
    barY: 'hidden',
};

/**
 * -----------------------------------
 * PAGE CONTROL
 * -----------------------------------
 */
const page = ref(0);
const activeQuestion = ref<Question | null>(null);

function nextPage() {
    page.value++;
}

function prevPage() {
    page.value--;
}

function hasPreviousPage() {
    return page.value == 0;
}

function hasNextPage() {
    return page.value + 1 == shuffledStems.value.length;
}

function navigateToIndex(index: number) {
    page.value = index;
    isNavigationEnabled.value = false;
}

/**
 * -----------------------------------
 * #### MODAL CONTROL
 * -----------------------------------
 */

const isGuideEnabled = ref(false);
const isNavigationEnabled = ref(false);
const blocked = ref(false);

watch(isGuideEnabled, (value) => {
    if (isNavigationEnabled.value) {
        isNavigationEnabled.value = false;
    }

    blocked.value = value;
});

watch(isNavigationEnabled, (value) => {
    if (isGuideEnabled.value) {
        isGuideEnabled.value = false;
    }

    blocked.value = value;
});

/**
 * -----------------------------------
 * MUTATE QUESTION & ANSWER FUNCTION
 * -----------------------------------
 */

function getAnswerForQuestion(questionCode: string): Answer {
    return (
        answers.value.data.find((answer) => answer.question_code === questionCode) || {
            question_code: '',
            option_code: null,
            isNotSure: false,
        }
    );
}

function isQuestionNotSure(questionCode: string): boolean {
    return getAnswerForQuestion(questionCode).isNotSure;
}

function isQuestionAnswered(questionCode: string): boolean {
    return getAnswerForQuestion(questionCode).option_code !== null;
}

function hasNotSureQuestions(): boolean {
    return answers.value.data.some((answer) => answer.isNotSure);
}

/**
 * -----------------------------------
 * UPDATE ACTIVE QUESTION FUNCTION
 * -----------------------------------
 */

function updateActiveQuestion(questionCode: string) {
    activeQuestion.value =
        shuffledStems.value
            .flatMap((stem) => stem.attributes.questions.data)
            .find((question) => question.attributes.code === questionCode) || null;
}

/**
 * -----------------------------------
 * DIALOG FUNCTION
 * -----------------------------------
 */

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
            size: 'small',
        },
        acceptProps: {
            label: 'Save',
            icon: 'pi pi-check',
            size: 'small',
        },
        accept: async () => {
            await submitAnswers();
        },
        reject: () => {
            // Do nothing
        },
    });
};

/**
 * -----------------------------------
 * SUBMIT FUNCTION
 * -----------------------------------
 */

async function submitAnswers() {
    isSubmitting.value = true;

    enableSubmit.value = false;

    let maxRetries = 10;
    let attempts = 0;
    let retryDelay = 5000;

    const formData = await JSON.parse(localStorage.getItem('formData') ?? '');
    const sessionData = await JSON.parse(localStorage.getItem('sessionData') ?? '');
    const userAnswer = await JSON.parse(localStorage.getItem('answers') ?? '');

    const name = await formData.username;
    const school = await formData.school;
    const age = await formData.age;
    const gender = await formData.gender.code;
    const schoolType = await formData.schoolType.code;

    const userData = {
        name,
        school,
        age,
        gender,
        schoolType,
    };

    const data = {
        userData,
        sessionData,
        userAnswer,
    };

    await $fetch(`${config.public.restApiURL}/responses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.public.apiToken}`,
        },
        body: JSON.stringify({
            data,
        }),
    })
        .then(() => {
            isSubmitting.value = false;
            router.push('/result/beta');
        })
        .catch((error) => {
            while (attempts < maxRetries) {
                console.error(`Attempt ${attempts + 1} failed: ${error.message}`);
                attempts += 1;

                if (attempts < maxRetries) {
                    console.log(`Retrying in ${(retryDelay * attempts) / 1000}s...`);
                    new Promise((resolve) => setTimeout(resolve, retryDelay * attempts));
                } else {
                    console.error('Max retries reached. Request failed.');
                }
            }
        });

    useStorage('isFinish', true);
}
</script>

<style lang="scss">
.stem {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        text-align: center;
    }

    img {
        max-width: 100%;
        margin: auto;
        border: 1px solid black;
        padding: 2px;
    }

    figcaption {
        font-size: 0.8rem;
        text-align: center;
        margin-top: 0.5rem;
    }

    a {
        color: #007bff;
        text-decoration: underline;
    }

    p {
        text-indent: 2rem;
        text-align: justify;
    }

    ol {
        list-style-type: decimal;
        margin-left: 2rem;
    }

    ul {
        list-style-type: disc;
        margin-left: 1rem;
    }
}

.question {
    figure {
        img {
            max-height: 10rem;
        }
    }
}

.option {
    label {
        display: flex;
    }

    figure {
        img {
            max-height: 5rem;
        }
    }
}
</style>
