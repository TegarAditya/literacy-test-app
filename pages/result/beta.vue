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

<script setup lang="ts">
useSeoMeta({
    title: 'Hasil Test',
    description: 'Hasil test yang telah kamu kerjakan',
})

interface Data {
    questions: Questions;
}

interface Questions {
    data: Question[];
}

interface Question {
    attributes: QuestionAttributes;
}

interface QuestionAttributes {
    code: string;
    options: Options;
}

interface Options {
    data: Option[];
}

interface Option {
    attributes: OptionAttributes;
}

interface OptionAttributes {
    code: string;
    is_correct: boolean;
}

const correctCount = ref(0)
const incorrectCount = ref(0)

let answers: any[] = []
onMounted(() => {
    const storedAnswers = localStorage.getItem('answers')
    const answersObject = storedAnswers ? JSON.parse(storedAnswers) : {}
    if (answersObject) {
        answers = answersObject.data.map((entry: { option_code: string; }) => entry.option_code);
    }

    correctCount.value = answers.filter((answer) => correctOptions.includes(answer)).length

    incorrectCount.value = answers.length - correctCount.value
})

const query = gql`
query Question {
  questions {
    data {
      attributes {
        code
        options (filters: {is_correct: {eq: true}}) {
          data {
            attributes {
              code
              is_correct
            }
          }
        }
      }
    }
  }
}
`
const { data } = await useAsyncQuery<Data>(query)

const correctOptions: string[] = data?.value?.questions.data
    .flatMap(question => question.attributes.options.data)
    .filter(option => option.attributes.is_correct)
    .map(option => option.attributes.code) ?? [];

</script>
