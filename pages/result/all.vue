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
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                >
                    <template #paginatorstart>
                        <Button type="button" icon="pi pi-refresh" text />
                    </template>
                    <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text @click="downloadCSV" />
                    </template>
                    <Column field="name" header="Name" style="width: 25%"></Column>
                    <Column field="country.name" header="Country" style="width: 25%"></Column>
                    <Column field="company" header="Company" style="width: 25%"></Column>
                    <Column field="representative.name" header="Representative" style="width: 25%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
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

// const responses = useState('responses', async () => {
//     const data = (await getResponseData()).data;
//     return data;
// });

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
