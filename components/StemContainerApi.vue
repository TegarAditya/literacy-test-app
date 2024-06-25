<template>
    <div v-if="shuffledStems">
        <ScrollPanel class="w-full h-[100dvh]" :pt="scrollPanelOptions">
            <div class="fixed w-full h-screen z-50 flex justify-center items-center" v-show="blocked">
                <Card class="w-full overflow-hidden max-w-xl mx-2">
                    <template #title>Panduan Pengerjaan</template>
                    <template #subtitle>Mohon dibaca dengan seksama</template>
                    <template #content>
                        <ScrollPanel style="width: 100%; height: 300px">
                            <ol class="list-outside list-disc ml-4 pb-10">
                                <li>Peserta meng-klik start attempt untuk memulai pengerjaan soal.</li>
                                <li>Peserta memilih jawaban soal dengan meng-klik pada lingkaran pilihan jawaban.</li>
                                <li>Peserta dapat meng-klik soal 1, soal 2, dan soal 3 untuk setiap bacaan yang
                                    diberikan.</li>
                                <li>Klik Next untuk pindah ke bacaan berikutnya.</li>
                                <li>Jika “ragu-ragu” terhadap jawaban yang dipilih, klik “tandai sebagai ragu-ragu” di
                                    bawah
                                    soal dan akan muncul tanda merah pada nomor soal yang ditandai.</li>
                                <li>Peserta ujian dapat melihat waktu ujian yang tersisa.</li>
                                <li>Setelah selesai menjawab seluruh soal, klik Finish Attempt, peserta dapat melihat
                                    seluruh
                                    status soal (terjawab, belum terjawab, dan ragu-ragu). Apabila ada soal yang belum
                                    terjawab,
                                    peserta dapat kembali ke menu soal dengan meng-klik Return to Attempt.</li>
                                <li>Setelah waktu tes habis dan masih terdapat jawaban ragu-ragu, Anda dianggap memilih
                                    jawaban
                                    tersebut.</li>
                                <li>Klik Submit, dan klik “yes” apabila peserta hendak mengirimkan hasil tes.</li>
                            </ol>
                            <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
                        </ScrollPanel>
                    </template>
                    <template #footer>
                        <div class="flex gap-3 mt-1">
                            <Button label="Mengerti" class="w-full" @click="blocked = !blocked" />
                        </div>
                    </template>
                </Card>
            </div>
            <BlockUI :blocked="blocked" :auto-z-index="true" class="z-30">
                <div class="w-full min-h-screen flex flex-col items-center py-20 px-2">
                    <div v-for="(stem, stemIndex) in shuffledStems" :key="stem.id">
                        <!-- Single Stem Panel -->
                        <div class="flex flex-col gap-4 lg:flex-row lg:justify-around md:mx-12 lg:w-[1000px]"
                            v-show="page == stemIndex">
                            <!-- Stem Text -->
                            <div class="p-5 w-full border-2 rounded-lg h-fit dark:text-white bg-white dark:bg-zinc-900">
                                <p class="text-lg font-bold">STEM {{ stemIndex + 1 }}</p>
                                <hr class="my-2">
                                <ScrollPanel class="h-56 md:h-80 md:max-h-80 lg:w-[300px] lg:h-96 lg:max-h-96"
                                    style="width: 100%;">
                                    <div class="w-full pr-2 gap-4 flex flex-col lg:mr-0 pb-10"
                                        v-html="stem.attributes.stem_field">
                                    </div>
                                    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
                                </ScrollPanel>
                            </div>

                            <!-- Questions with Options -->
                            <div class="border-2 rounded-lg overflow-hidden w-full h-fit">
                                <Accordion :activeIndex="null">
                                    <AccordionTab v-for="(question, questionIndex) in stem.attributes.questions.data"
                                        :key="question.id">
                                        <template #header>
                                            <span class="flex items-center gap-2 w-full">
                                                <span class="font-bold white-space-nowrap">Soal {{ questionIndex + 1
                                                    }}</span>
                                                <Badge v-if="isQuestionNotSure(question.attributes.code)"
                                                    value="Ragu-ragu" class="ml-auto px-2 mr-2" severity="danger" />
                                            </span>
                                        </template>
                                        <div class="m-0" v-html="question.attributes.question_field"></div>
                                        <div class="py-5 flex flex-col gap-2">
                                            <div class="flex items-center bg-gray-50 dark:bg-zinc-800 p-2 rounded-md"
                                                v-for="(option) in question.attributes.options.data"
                                                :key="option.attributes.code"
                                                @click="getAnswerForQuestion(question.attributes.code).option_code = option.attributes.code">
                                                <RadioButton :inputId="option.attributes.code"
                                                    :name="`question-${question.attributes.code}`"
                                                    :value="option.attributes.code"
                                                    v-model="getAnswerForQuestion(question.attributes.code).option_code" />
                                                <label :for="option.attributes.code" class="ml-2"
                                                    v-html="option.attributes.option"></label>
                                            </div>
                                        </div>
                                        <div
                                            class="bg-yellow-100 dark:bg-zinc-700 flex items-center justify-center p-1 rounded-lg">
                                            <div class="space-x-2 flex items-center">
                                                <Checkbox :inputId="`notSure-${question.id}`" :binary="true"
                                                    v-model="getAnswerForQuestion(question.attributes.code).isNotSure" />
                                                <label :for="`notSure-${question.id}`" class="min-w-full">Tandai sebagai
                                                    ragu-ragu</label>
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
    <div v-else>
        <ProgressSpinner aria-label="Loading" />
    </div>

    <!-- Main Header -->
    <div class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 top-0 flex justify-center items-center">
        <div class="bg-white p-2 min-w-40 rounded-full shadow-inner">
            <p class="dark:text-white text-center font-bold">Test</p>
        </div>
    </div>

    <!-- Navigation Buttons Full -->
    <div
        class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 bottom-0 md:flex justify-center items-center gap-1 md:gap-4 hidden">
        <Button :severity="'info'" icon="pi pi-info-circle" @click="blocked = !blocked" rounded />
        <Button :severity="'secondary'" icon="pi pi-angle-left" label="Previous" :disabled="page == 0" @click="prevPage"
            raised rounded />
        <Button :severity="'secondary'" icon="pi pi-angle-right" iconPos="right" label="Next"
            :disabled="(page + 1) == shuffledStems.length" @click="nextPage" raised rounded />
        <Button :severity="'success'" label="Submit" @click="submitAnswers" raised rounded />
    </div>

    <!-- Navigation Buttons Small -->
    <div
        class="w-full h-14 bg-blue-400 dark:bg-black fixed z-40 bottom-0 flex justify-center items-center gap-2 md:gap-4 md:hidden">
        <Button :severity="'info'" icon="pi pi-info-circle" @click="blocked = !blocked" rounded />
        <Button :severity="'secondary'" icon="pi pi-angle-left" aria-label="Previous" :disabled="page == 0"
            @click="prevPage" raised rounded />
        <Button :severity="'secondary'" icon="pi pi-angle-right" iconPos="right" aria-label="Next"
            :disabled="(page + 1) == shuffledStems.length" @click="nextPage" raised rounded />
        <Button :severity="'success'" label="Submit" @click="submitAnswers" raised rounded />
    </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

import type { ScrollPanelPassThroughOptions } from 'primevue/scrollpanel'
import type { PassThrough } from 'primevue/ts-helpers'

interface Data {
    stems: Stems
}

interface Stems {
    data: Stem[]
    meta: Meta
}

interface Stem {
    id: string
    attributes: {
        name: string
        stem_field: string
        questions: Questions
    }
}

interface Questions {
    data: Question[]
}

interface Question {
    id: string
    attributes: {
        code: string
        order: number
        question_field: string
        options: Options
    }
}

interface Options {
    data: Option[]
}

interface Option {
    attributes: {
        option: string
        is_correct: boolean
        code: string
    }
}

interface Meta {
    pagination: {
        total: number
    }
}

interface Answers {
    data: Answer[]
}

interface Answer {
    question_code: string
    option_code: string | null
    isNotSure: boolean
}

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
                      is_correct
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
`

const { data } = await useAsyncQuery<Data>(query)

const shuffledStems = computed(() => {
    if (data.value) {
        return shuffle([...data.value.stems.data])
    }
    return []
})

const answers = ref<Answers>({ data: [] })

watch(shuffledStems, (newStems) => {
    if (newStems.length) {
        const initialAnswers: Answer[] = []
        newStems.forEach(stem => {
            stem.attributes.questions.data.forEach(question => {
                initialAnswers.push({
                    question_code: question.attributes.code,
                    option_code: null,
                    isNotSure: false,
                })
            })
        })
        answers.value = { data: initialAnswers }
    }
}, { immediate: true })

const savedAnswers = useStorage('answers', answers.value)

watch(answers, () => {
    savedAnswers.value = answers.value
}, { deep: true })

onMounted(() => {
    if (savedAnswers.value) {
        answers.value = savedAnswers.value
    }
})

const scrollPanelOptions: PassThrough<ScrollPanelPassThroughOptions> = {
    wrapper: {
        style: { 'border-right': 'none' }
    },
    barY: 'hidden'
}

const page = ref(0)

function nextPage() {
    page.value++
}

function prevPage() {
    page.value--
}

const blocked = ref(false)

function getAnswerForQuestion(questionCode: string): Answer {
    return answers.value.data.find(answer => answer.question_code === questionCode) || { question_code: '', option_code: null, isNotSure: false }
}

function isQuestionNotSure(questionCode: string): boolean {
    return getAnswerForQuestion(questionCode).isNotSure
}

async function submitAnswers() {
    const formData = await JSON.parse(localStorage.getItem('formData') ?? '');

    const name = await formData.username;
    const school = await formData.school;
    const age = await formData.age;
    const gender = await formData.gender.code;
    const schoolType = await formData.schoolType.code;

    const query = gql`
        mutation createParticipant ($input: ParticipantInput!) {
            createParticipant(
                data: $input
            ) {
                data {
                id
                }
            }
        }
        `
    const variables = {
        name: name,
        school: school,
        age: age,
        gender: gender.code,
        school_type: schoolType.code,
    }

    try {
        const { mutate: createParticipant } = await useMutation(query, { variables });
        const result = await createParticipant();
        console.log('Mutation result:', result);
    } catch (error) {
        console.error('Mutation error:', error);
    }
}
</script>

<style scoped>
/* Add your custom styles here */
</style>
