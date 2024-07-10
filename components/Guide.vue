<template>
    <Card class="w-full overflow-hidden max-w-xl mx-2">
        <template #title>Panduan Pengerjaan</template>
        <template #subtitle>Mohon dibaca dengan seksama</template>
        <template #content>
            <ScrollPanel style="width: 100%; height: 300px">
                <div
                    v-if="data?.guide.data.attributes.guide_field"
                    v-html="data?.guide.data.attributes.guide_field"
                    class="guide pr-3"
                ></div>
                <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up" />
            </ScrollPanel>
        </template>
        <template #footer>
            <div class="flex gap-3 mt-1">
                <Button label="Mengerti" class="w-full" @click="show" />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import type { GuideResponse } from '~/types/guide';

const emit = defineEmits(['trigger']);

const show = () => emit('trigger');

const query = gql`
    query getGuide {
        guide {
            data {
                attributes {
                    guide_field
                }
            }
        }
    }
`;

const { data } = await useAsyncQuery<GuideResponse>(query);
</script>

<style lang="scss">
.guide {
    ol {
        list-style-type: decimal;
        padding-left: 1em;
        gap: 0.5rem;

        li {
            text-align: justify;
        }
    }
}
</style>
