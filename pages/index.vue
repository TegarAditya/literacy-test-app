<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import type { Ref } from 'vue';

const genderOptions = [
  { name: 'Laki-laki', code: 'L' },
  { name: 'Perempuan', code: 'P' },
];

const schoolTypeOptions = [
  { name: 'Swasta', code: 'swasta' },
  { name: 'Negeri', code: 'negeri' },
];

interface Step {
  label: string;
  model: Ref<string>;
  placeholder: string;
  id: string;
  type: string;
  mode: string;
  options?: any[];
}

// Initialize formData with localStorage handling
const { storedValue: formData, setValue: updateFormData } = useLocalStorage(
  'formData',
  {
    username: '',
    school: '',
    schoolType: '',
    age: '',
    gender: '',
  }
);

// Define steps
const steps: Step[] = [
  {
    label: 'Nama / Inisial',
    model: ref(formData.value.username),
    placeholder: 'Isi dengan nama lengkap',
    id: 'username',
    type: 'text',
    mode: 'text',
  },
  {
    label: 'Asal Sekolah',
    model: ref(formData.value.school),
    placeholder: 'Isi dengan asal sekolah',
    id: 'school',
    type: 'text',
    mode: 'text',
  },
  {
    label: 'Jenis Sekolah',
    model: ref(formData.value.gender),
    placeholder: 'Isi dengan jenis sekolah',
    id: 'schoolType',
    type: 'select',
    mode: 'select',
    options: schoolTypeOptions,
  },
  {
    label: 'Usia (tahun)',
    model: ref(formData.value.age),
    placeholder: 'Isi dengan usia saat ini',
    id: 'age',
    type: 'number',
    mode: 'text',
  },
  {
    label: 'Gender',
    model: ref(formData.value.gender),
    placeholder: 'Isi dengan jenis kelamin',
    id: 'gender',
    type: 'select',
    mode: 'select',
    options: genderOptions,
  }
];

const currentStep = ref(0);

// Watch for changes in each step's model and sync to localStorage
steps.forEach(step => {
  watch(step.model, (newVal) => {
    updateFormData({
      ...formData.value,
      [step.id]: newVal,
    });
  });
});

// Sync with localStorage on component mount
onMounted(() => {
  steps.forEach(step => {
    step.model.value = formData.value[step.id];
  });
});

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

const submitForm = () => {
  // Check if all required fields are filled
  const incompleteStep = steps.find(step => !step.model);
  if (incompleteStep) {
    // Alert user about incomplete form
    alert(`Please fill in ${incompleteStep.label}`);
  } else {
    // @ts-ignore
    navigateTo('/otp')
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
            <InputText 
              v-if="steps[currentStep].mode === 'text'" 
              :id="steps[currentStep].id" 
              v-model="steps[currentStep].model.value"
              :aria-describedby="`${steps[currentStep].id}-help`" 
              :type="steps[currentStep].type"
              class="w-72" 
            />
            <Dropdown 
              v-if="steps[currentStep].mode === 'select'" 
              :id="steps[currentStep].id" 
              v-model="steps[currentStep].model.value"
              :options="steps[currentStep].options" 
              optionLabel="name" 
              placeholder="Pilih"
              :aria-describedby="`${steps[currentStep].id}-help`" 
              class="w-72" 
            />
          </div>
          <small :id="`${steps[currentStep].id}-help`">{{ steps[currentStep].placeholder }}</small>
          <div class="flex justify-between mt-4">
            <div v-if="currentStep == 0"></div>
            <Button label="Previous" icon="pi pi-angle-left" @click="prevStep" v-if="currentStep > 0" />
            <Button label="Next" icon="pi pi-angle-right" @click="nextStep" v-if="currentStep < steps.length - 1" />
            <Button label="Submit" icon="pi pi-check" v-if="currentStep === steps.length - 1" @click="submitForm"/>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
