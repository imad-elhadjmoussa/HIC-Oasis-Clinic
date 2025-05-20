<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Button, Dialog, InputText, Select } from 'primevue';
import { updatePrestation } from '../../api/prestation';

const toast = useToast();
const props = defineProps({
    visible: Boolean,
    prestation: Object,
    specialties: Array
});

const emit = defineEmits(['update:visible', 'update:prestation', 'prestation-updated']);

const editedPrestation = ref({ ...props.prestation });
const loading = ref(false);

watch(() => props.prestation, (newVal) => {
    editedPrestation.value = { ...newVal };
});

const submit = async () => {
    loading.value = true;
    try {
        // Call your API here
        const data = await updatePrestation(editedPrestation.value.id, editedPrestation.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Prestation updated successfully',
            life: 3000,
        });
        emit('prestation-updated');
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
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Edit Prestation" :modal="true"
        :style="{ width: '450px' }">

        <div class=" flex flex-col gap-3">
            <div class="field">
                <label for="prestation_code">Prestation Code</label>
                <InputText size="small" id="prestation_code" v-model.trim="editedPrestation.prestation_code"
                    class="w-full" placeholder="Prestation Code" />
            </div>
            <div class="field">
                <label for="prestation_name">Prestation Name</label>
                <InputText size="small" id="prestation_name" v-model.trim="editedPrestation.prestation_name"
                    class="w-full" placeholder="Prestation Name" />
            </div>
            <div class="field">
                <label for="specialty_id">Specialty</label>
                <Select size="small" v-model="editedPrestation.specialty_id" optionValue="id" :options="specialties"
                    optionLabel="specialty_name" placeholder="Select a Specialty" class="w-full" />
            </div>
        </div>

        <template #footer>
            <Button size="small" label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDialog" />
            <Button size="small" label="Save" icon="pi pi-check" class="p-button-success" @click="submit"
                :loading="loading" />
        </template>
    </Dialog>
</template>