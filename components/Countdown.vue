<template>
    <div>
        {{ countdown }}
    </div>
</template>

<script lang="ts" setup>
import { isClient } from '@vueuse/core';
import type { Session } from '~/types/session';

const countdown = useState('remaining_time');
const _time = useState('duration', () => getDuration());

let interval: ReturnType<typeof setInterval>;

onMounted(async () => {
    const duration: Session = getDuration();

    const targetDate = await getTargetDate(duration.attributes.duration);

    countdown.value = calculateTimeDifference(targetDate);
    interval = setInterval(() => {
        countdown.value = calculateTimeDifference(targetDate);
        if (countdown.value === '00:00:00') {
            clearInterval(interval);
        }
    }, 1000);
});

onUnmounted(() => {
    clearInterval(interval);
});

async function getTargetDate(duration: number) {
    if (isClient && localStorage.getItem('targetDate')) {
        return new Date(localStorage.getItem('targetDate')!);
    }
    const time = new Date().toString();

    return setTargetTime(time, duration);
}

function getDuration() {
    if (isClient) {
        return JSON.parse(localStorage.getItem('sessionData') ?? '');
    }
}
</script>

<style scoped>
/* Add any styles you need here */
</style>
