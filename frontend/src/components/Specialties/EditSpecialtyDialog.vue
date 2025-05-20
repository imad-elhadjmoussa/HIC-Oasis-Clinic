<script setup>
import { ref, watch } from 'vue';
import { Button, InputText } from 'primevue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import { updateSpecialty } from '../../api/specialty';


const toast = useToast();
const props = defineProps({
    visible: Boolean,
    specialty: Object
});

const emit = defineEmits(['update:visible', 'update:specialty', 'specialty-updated']);

const editedSpecialty = ref({ ...props.specialty });
const loading = ref(false);

watch(() => props.specialty, (newVal) => {
    editedSpecialty.value = { ...newVal };
});

const submit = async () => {
    loading.value = true;
    try {
        // Call your API here
        const data = await updateSpecialty(editedSpecialty.value.id, editedSpecialty.value);
        // await ;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message,
            life: 3000,
        });
        emit('specialty-updated');
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
    emit('update:visible', false);
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Edit Specialty" :modal="true"
        :style="{ width: '450px' }" :closable="false">

        <div class="flex flex-col gap-3 ">
            <label for="specialty_name" class="block">Specialty Name</label>
            <InputText size="small" placeholder="Specialty"  id="specialty_name" v-model.trim="editedSpecialty.specialty_name" class="w-full"
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