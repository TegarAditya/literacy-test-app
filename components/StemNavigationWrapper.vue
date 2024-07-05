<template>
    <Card class="w-full overflow-hidden max-w-xl mx-2">
        <template #title> <h1 class="font-bold">Daftar Bacaan</h1></template>
        <template #subtitle>Klik pada nomor untuk menuju nomor tersebut</template>
        <template #content>
            <ScrollPanel style="width: 100%; height: 300px">
                <slot />
                <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
            </ScrollPanel>
        </template>
        <template #footer>
            <div class="flex gap-3 mt-1">
                <Button label="Kembali" severity="secondary" class="w-full" @click="show" />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
const emit = defineEmits(['trigger']);

const show = () => emit('trigger');
</script>
