<template>
  <div>
    {{ countdown }}
  </div>
</template>

<script lang="ts" setup>
const countdown = useState('remaining_time');
const now = new Date();
const targetDate = new Date(now.setMinutes(now.getMinutes() + 120)); // Set your target date and time here

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
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
</script>

<style scoped>
/* Add any styles you need here */
</style>
