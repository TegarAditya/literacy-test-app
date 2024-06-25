<script setup lang="ts">
const { isFullscreen, toggle } = useFullscreen();

preloadRouteComponents('/test/app');

async function startTest() {
    await navigateTo('/test/app');

    if (!isFullscreen.value) {
        toggle();
    }
}

</script>

<template>
    <div class="w-full px-2 flex justify-center items-center h-screen z-30" v-show="true">
        <Card class="w-full overflow-hidden max-w-xl">
            <template #title>Panduan Pengerjaan</template>
            <template #subtitle>Mohon dibaca dengan seksama</template>
            <template #content>
                <ScrollPanel style="width: 100%; height: 300px">
                    <ol class="list-outside list-disc ml-4 pb-10">
                        <li>Peserta meng-klik start attempt untuk memulai pengerjaan soal.</li>
                        <li>Peserta memilih jawaban soal dengan meng-klik pada lingkaran pilihan jawaban.</li>
                        <li>Peserta dapat meng-klik soal 1, soal 2, dan soal 3 untuk setiap bacaan yang diberikan.</li>
                        <li>Klik Next untuk pindah ke bacaan berikutnya.</li>
                        <li>Jika “ragu-ragu” terhadap jawaban yang dipilih, klik “tandai sebagai ragu-ragu” di bawah
                            soal dan akan muncul tanda merah pada nomor soal yang ditandai.</li>
                        <li>Peserta ujian dapat melihat waktu ujian yang tersisa.</li>
                        <li>Setelah selesai menjawab seluruh soal, klik Finish Attempt, peserta dapat melihat seluruh
                            status soal (terjawab, belum terjawab, dan ragu-ragu). Apabila ada soal yang belum terjawab,
                            peserta dapat kembali ke menu soal dengan meng-klik Return to Attempt.</li>
                        <li>Setelah waktu tes habis dan masih terdapat jawaban ragu-ragu, Anda dianggap memilih jawaban
                            tersebut.</li>
                        <li>Klik Submit, dan klik “yes” apabila peserta hendak mengirimkan hasil tes.</li>
                    </ol>
                    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
                </ScrollPanel>
            </template>
            <template #footer>
                <div class="flex gap-3 mt-1">
                    <Button label="Mulai" class="w-full" @click="startTest"/>
                </div>
            </template>
        </Card>
    </div>
</template>