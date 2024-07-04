<script setup lang="ts">
const genderOptions = [
    { name: 'Laki-laki', code: 'L' },
    { name: 'Perempuan', code: 'P' },
];

const schoolTypeOptions = [
    { name: 'Swasta', code: 'Swasta' },
    { name: 'Negeri', code: 'Negeri' },
];

interface Step {
    label: string;
    model: Ref<string>;
    placeholder?: string;
    hint?: string;
    id: string;
    type: string;
    mode: string;
    options?: any[];
}

// Initialize formData with localStorage handling
const { storedValue: formData, setValue: updateFormData } = useLocalStorage('formData', {
    username: '',
    school: '',
    schoolType: '',
    age: '',
    gender: '',
});

// Define steps
const steps: Step[] = [
    {
        label: 'Nama / Inisial',
        model: ref(formData.value.username),
        placeholder: 'Ahmad Taufik',
        hint: 'Isi dengan nama atau inisial',
        id: 'username',
        type: 'text',
        mode: 'text',
    },
    {
        label: 'Asal Sekolah',
        model: ref(formData.value.school),
        placeholder: 'SMAN 1 Surakarta',
        hint: 'Isi dengan asal sekolah',
        id: 'school',
        type: 'text',
        mode: 'text',
    },
    {
        label: 'Jenis Sekolah',
        model: ref(formData.value.schoolType),
        placeholder: 'Pilih salah satu',
        hint: 'Isi dengan jenis sekolah',
        id: 'schoolType',
        type: 'select',
        mode: 'select',
        options: schoolTypeOptions,
    },
    {
        label: 'Usia (tahun)',
        model: ref(formData.value.age),
        placeholder: '17',
        hint: 'Isi dengan angka usia saat ini',
        id: 'age',
        type: 'number',
        mode: 'text',
    },
    {
        label: 'Jenis Kelamin',
        model: ref(formData.value.gender),
        placeholder: 'Pilih salah satu',
        hint: 'Isi dengan jenis kelamin',
        id: 'gender',
        type: 'select',
        mode: 'select',
        options: genderOptions,
    },
];

// Watch for changes in each step's model and sync to localStorage
steps.forEach((step) => {
    watch(step.model, (newVal) => {
        updateFormData({
            ...formData.value,
            [step.id]: newVal,
        });
    });
});

// Sync with localStorage on component mount
onMounted(() => {
    steps.forEach((step) => {
        step.model.value = formData.value[step.id];
    });
});

const submitForm = () => {
    // Check if all required fields are filled
    const incompleteStep = steps.find((step) => !step.model.value);
    if (incompleteStep) {
        alert(`Please fill in ${incompleteStep.label}`);
    } else {
        // Handle form submission
        console.log('Form submitted:', formData.value);
        // Here you can redirect or send formData to an API
        navigateTo('/otp');
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center w-screen h-screen dark:bg-gray-900">
        <div class="flex items-center space-x-2 justify-center">
            <form action="" @submit.prevent="submitForm">
                <div class="flex flex-col gap-2 dark:text-white">
                    <!-- Render all steps -->
                    <div v-for="step in steps" :key="step.id" class="mb-4">
                        <label :for="step.id">{{ step.label }}</label>
                        <div class="flex gap-2">
                            <InputText
                                v-if="step.mode === 'text'"
                                :id="step.id"
                                v-model="step.model.value"
                                :placeholder="step.placeholder"
                                :aria-describedby="`${step.id}-help`"
                                :type="step.type"
                                class="w-72"
                            />
                            <Dropdown
                                v-if="step.mode === 'select'"
                                :id="step.id"
                                v-model="step.model.value"
                                :options="step.options"
                                optionLabel="name"
                                :placeholder="step.placeholder"
                                :aria-describedby="`${step.id}-help`"
                                class="w-72"
                            />
                        </div>
                        <small :id="`${step.id}-help`" class="text-gray-500">{{ step.hint }}</small>
                    </div>
                    <!-- Submit button -->
                    <div class="flex justify-center mt-4">
                        <Button label="Submit" type="submit" class="w-full" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
