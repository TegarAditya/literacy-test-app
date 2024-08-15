<template>
    <div class="flex justify-center items-center w-screen min-h-screen">
        <div class="rounded-lg overflow-hidden shadow-2xl">
            <div class="card">
                <DataTable
                    :value="customers"
                    paginator
                    :rows="5"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} - {last} dari {totalRecords}"
                >
                    <template #paginatorstart>
                        <Button type="button" icon="pi pi-refresh" text />
                    </template>
                    <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text @click="downloadCSV" />
                    </template>
                    <Column field="name" header="Name" style="width: 25%"></Column>
                    <ColumnGroup type="header">
                        <Row>
                            <Column field="country.name" header="Country" style="width: 25%"></Column>
                            <Column field="company" header="Company" style="width: 25%"></Column>
                        </Row> 
                    </ColumnGroup>
                    <Column field="country.name" header="Country" style="width: 25%"></Column>
                    <Column field="company" header="Company" style="width: 25%"></Column>
                    <Column field="representative.name" header="Representative" style="width: 25%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Responses, Response } from '~/types/response';

const config = useRuntimeConfig();

const customers = ref([
    {
        name: 'John',
        country: { name: 'USA' },
        company: 'Company A',
        representative: { name: 'Alex' },
    },
    {
        name: 'Paul',
        country: { name: 'Canada' },
        company: 'Company B',
        representative: { name: 'Bruce' },
    },
    {
        name: 'George',
        country: { name: 'Mexico' },
        company: 'Company C',
        representative: { name: 'Lee' },
    },
    {
        name: 'Ringo',
        country: { name: 'Brazil' },
        company: 'Company D',
        representative: { name: 'Mike' },
    },
    {
        name: 'Paul',
        country: { name: 'Canada' },
        company: 'Company B',
        representative: { name: 'Bruce' },
    },
    {
        name: 'George',
        country: { name: 'Mexico' },
        company: 'Company C',
        representative: { name: 'Lee' },
    },
    {
        name: 'Ringo',
        country: { name: 'Brazil' },
        company: 'Company D',
        representative: { name: 'Mike' },
    },
]);

const responses: Ref<Response[] | null> = ref(null);

onMounted(async () => {
    await $fetch(`${config.public.restApiURL}/responses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.public.apiToken}`,
        },
    })
        .then((res: any) => {
            responses.value = res.data;
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
        });
});

function downloadCSV() {
    const csv = customers.value.map((customer) => Object.values(customer).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<style></style>
