<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

const gender = ref([
  { name: 'Laki-laki', code: 'L' },
  { name: 'Perempuan', code: 'P' },
]);

interface Step {
  label: string;
  model: Ref<string>;
  placeholder: string;
  id: string;
  type: string;
  mode?: string | undefined;
}

// Step data
const steps: Step[] = [
  {
    label: 'Nama Lengkap',
    model: ref(''),
    placeholder: 'Isi dengan nama lengkap',
    id: 'username',
    type: 'text',
    mode: 'text',
  },
  {
    label: 'Email',
    model: ref(''),
    placeholder: 'Isi dengan email yang valid',
    id: 'email',
    type: 'email',
    mode: 'text',
  },
  {
    label: 'Telepon',
    model: ref(''),
    placeholder: 'Isi dengan nomor telepon yang bisa dihubungi',
    id: 'phone',
    type: 'phone',
    mode: 'text',
  },
  {
    label: 'Asal Sekolah',
    model: ref(''),
    placeholder: 'Isi dengan asal sekolah',
    id: 'school',
    type: 'text',
    mode: 'text',
  },
  {
    label: 'Usia (tahun)',
    model: ref(''),
    placeholder: 'Isi dengan usia saat ini',
    id: 'age',
    type: 'number',
    mode: 'text',
  },
  {
    label: 'Gender',
    model: ref(''),
    placeholder: 'Isi dengan jenis kelamin',
    id: 'gender',
    type: 'select',
    mode: 'select',
  }
];

const currentStep = ref(0);

// Navigation functions
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value += 1;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen dark:bg-gray-900">
    <div class="flex items-center space-x-2 justify-center">
      <form action="">
        <div class="flex flex-col gap-2 dark:text-white">
          <label :for="steps[currentStep].id">{{ steps[currentStep].label }}</label>
          <div class="flex gap-2">
            <InputText :id="steps[currentStep].id" v-model="steps[currentStep].model.value"
              v-if="steps[currentStep].mode === 'text'" :aria-describedby="`${steps[currentStep].id}-help`" :type="steps[currentStep].type"
              class="w-72" />
            <Dropdown v-model="steps[currentStep].model.value" v-if="steps[currentStep].mode === 'select'"
              :options="gender" optionLabel="name" placeholder="Pilih"
              :aria-describedby="`${steps[currentStep].id}-help`" class="w-72" />
          </div>
          <small :id="`${steps[currentStep].id}-help`">{{ steps[currentStep].placeholder }}</small>
          <div class="flex justify-between mt-4">
            <div v-if="currentStep == 0"></div>
            <Button label="Previous" icon="pi pi-angle-left" @click="prevStep" v-if="currentStep > 0" />
            <Button label="Next" icon="pi pi-angle-right" @click="nextStep" v-if="currentStep < steps.length - 1" />
            <Button label="Submit" icon="pi pi-check" v-if="currentStep === steps.length - 1" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
@import url('~/assets/css/base.css');
@import url('primeicons/primeicons.css');
</style>
