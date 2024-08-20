<template>
    <div class="flex justify-center items-center w-screen min-h-screen">
        <div class="rounded-lg overflow-hidden shadow-2xl">
            <div class="card" v-if="responses">
                <DataTable
                    :value="responses.data"
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
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Responses } from '~/types/response';

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

function downloadCSV() {
    // const csv = customers.value.map((customer) => Object.values(customer).join(',')).join('\n');
    // const blob = new Blob([csv], { type: 'text/csv' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'customers.csv';
    // a.click();
    // URL.revokeObjectURL(url);
}
</script>

<style></style>
