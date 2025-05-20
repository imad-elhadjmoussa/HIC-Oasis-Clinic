<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Button, InputText } from 'primevue';
import Dialog from 'primevue/dialog';
import { createSpecialty } from '../../api/specialty'; // Adjust the import path as necessary

const toast = useToast();
const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(['update:visible', 'specialty-created']);

const specialty = ref({
    specialty_name: ''
});
const loading = ref(false);

const submit = async () => {
    loading.value = true;
    try {
        // Call your API here
        const data = await createSpecialty(specialty.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message,
            life: 3000,
        });
        emit('specialty-created');
        closeDialog();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000,
        });
    } finally {
        loading.value = false;
    }
};

const closeDialog = () => {
    specialty.value = { specialty_name: '' };
    emit('update:visible', false);
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Add New Specialty"
        :modal="true" :style="{ width: '450px' }" :closable="false">
        <div class="flex flex-col gap-3 ">
            <label for="specialty_name" class="block">Specialty Name</label>
            <InputText size="small" placeholder="Specialty"  id="specialty_name" v-model.trim="specialty.specialty_name" class="w-full"
                autofocus />
        </div>

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button size="small" label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDialog" />
                <Button size="small" label="Save" icon="pi pi-check" class="p-button-success" @click="submit" :loading="loading" />
            </div>
        </template>
    </Dialog>
</template>