<template>
    <div class="flex justify-center items-center w-screen min-h-screen">
        <div class="rounded-lg overflow-hidden shadow-2xl">
            <div class="card" v-if="responses">
                <DataTable
                    :value="formattedResponses"
                    paginator
                    :rows="5"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                >
                    <template #paginatorstart>
                        <Button type="button" icon="pi pi-refresh" text />
                    </template>
                    <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text @click="downloadCSV" />
                    </template>
                    <Column field="id" header="ID"></Column>
                    <Column field="attributes.createdAt" header="Waktu Pengumpulan"></Column>
                    <Column field="attributes.userData.name" header="Nama"></Column>
                    <Column field="attributes.userData.age" header="Umur"></Column>
                    <Column field="attributes.userData.gender" header="Jenis Kelamin"></Column>
                    <Column field="attributes.userData.school" header="Asal Sekolah"></Column>
                    <Column field="attributes.userData.schoolType" header="Tipe Sekolah"></Column>

                    <!-- Dynamically generate columns for each question -->
                    <Column
                        v-for="question in questionCodes"
                        :key="question"
                        :field="question"
                        :header="`Question ${question}`"
                    ></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Responses } from '~/types/response';
import { ref, computed } from 'vue';

const config = useRuntimeConfig();

const responses = ref<Responses>();

onMounted(async () => {
    responses.value = await $fetch(`${config.public.restApiURL}/responses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.public.apiToken}`,
        },
    });
});

// Extract question codes dynamically
const questionCodes = computed(() => {
    if (!responses.value || !responses.value.data.length) return [];
    const sampleAnswers = responses.value.data[0].attributes.userAnswer.data;
    return sampleAnswers.map(answer => answer.question_code);
});

// Format the responses to include answers with their question codes as keys
const formattedResponses = computed(() => {
    if (!responses.value) return [];

    return responses.value.data.map(response => {
        const formattedResponse: any = { ...response };

        response.attributes.userAnswer.data.forEach(answer => {
            formattedResponse[answer.question_code] = answer.option_code || 'N/A';
        });

        return formattedResponse;
    });
});

function downloadCSV() {
    // CSV download logic goes here
}
</script>

<style></style>
