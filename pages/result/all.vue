<template>
    <div class="flex justify-center items-center w-screen min-h-screen">
        <div class="mx-8 rounded-lg overflow-hidden shadow-2xl">
            <div class="card" v-if="responses">
                <DataTable
                    :value="formattedResponses"
                    paginator
                    :rows="8"
                    :rowsPerPageOptions="[5, 8, 10, 20, 50]"
                    tableStyle="min-width: 50rem"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                >
                    <template #paginatorstart>
                        <Button type="button" icon="pi pi-refresh" text @click="refresh" />
                    </template>
                    <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text @click="downloadCSV" />
                    </template>
                    <Column field="id" header="ID"></Column>
                    <Column field="attributes.sessionData.attributes.name" header="Sesi" class="min-w-48"></Column>
                    <Column field="attributes.sessionData.attributes.duration" header="Durasi (menit)"></Column>
                    <Column field="attributes.createdAt" header="Waktu Pengumpulan"></Column>
                    <Column field="attributes.userData.name" header="Nama" class="min-w-56"</Column>
                    <Column field="attributes.userData.age" header="Umur"></Column>
                    <Column field="attributes.userData.gender" header="Jenis Kelamin"></Column>
                    <Column field="attributes.userData.school" header="Asal Sekolah" class="min-w-48"></Column>
                    <Column field="attributes.userData.schoolType" header="Tipe Sekolah"></Column>

                    <!-- Dynamically generate columns for each question -->
                    <Column
                        v-for="(question, index) in questionCodes"
                        :key="question"
                        :field="question"
                        :header="`Q ${question}`"
                        :class="index % 2 === 0 ? 'bg-gray-50' : ''"
                    ></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Responses } from '~/types/response';
import { ref, computed } from 'vue';

definePageMeta({
    layout: 'admin',
})

const config = useRuntimeConfig();

const responses = ref<Responses>();

onMounted(async () => {
    responses.value = await $fetch(`${config.public.restApiURL}/responses?pagination[limit]=5000`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.public.apiToken}`,
        },
    });
});

// Custom sorting function to sort question codes numerically
function sortQuestionCodes(a: string, b: string): number {
    const splitA = a.split('.').map(Number);
    const splitB = b.split('.').map(Number);

    for (let i = 0; i < Math.max(splitA.length, splitB.length); i++) {
        const numA = splitA[i] || 0;
        const numB = splitB[i] || 0;
        if (numA !== numB) {
            return numA - numB;
        }
    }
    return 0;
}

// Extract question codes dynamically
const questionCodes = computed(() => {
    if (!responses.value || !responses.value.data.length) return [];
    const sampleAnswers = responses.value?.data?.at(-1)?.attributes?.userAnswer?.data || [];
    return sampleAnswers.map((answer) => answer.question_code).sort(sortQuestionCodes);
});

// Format the responses to include answers with their question codes as keys
const formattedResponses = computed(() => {
    if (!responses.value) return [];

    return responses.value.data.map((response) => {
        const formattedResponse: any = { ...response };

        response.attributes.userAnswer.data.forEach((answer) => {
            const optionCode = answer.option_code;
            formattedResponse[answer.question_code] = optionCode ? optionCode.slice(-1).toUpperCase() : 'X';
        });

        return formattedResponse;
    });
});

async function refresh() {
    responses.value = await $fetch(`${config.public.restApiURL}/responses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.public.apiToken}`,
        },
    });
}

function downloadCSV() {
    // Convert the data to CSV format
    const headers = [
        'ID',
        'Sesi',
        'Durasi (menit)',
        'Waktu Pengumpulan',
        'Nama',
        'Umur',
        'Jenis Kelamin',
        'Asal Sekolah',
        'Tipe Sekolah',
        ...questionCodes.value.map((code) => `Q ${code}`),
    ];

    const csvRows = [
        headers.join(','), // CSV Header row
        ...formattedResponses.value.map((response) => {
            return [
                response.id,
                response.attributes.sessionData?.attributes.name ?? '-',
                response.attributes.sessionData?.attributes.duration ?? '-',
                response.attributes.createdAt,
                response.attributes.userData.name,
                response.attributes.userData.age,
                response.attributes.userData.gender,
                response.attributes.userData.school,
                response.attributes.userData.schoolType,
                ...questionCodes.value.map((code) => response[code]),
            ].join(',');
        }),
    ];

    const csvString = csvRows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'responses.csv';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>

<style></style>
