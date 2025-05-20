<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { updatePatient, validatePatient } from '../../api/patient';
import { Toast, useToast } from 'primevue';
import { bloodTypes, genders, showNotification } from '../../pages/Reception';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    patient: {
        type: Object,
        required: true
    }
});

const toast = useToast();

const emit = defineEmits(['update:visible', 'save', 'close']);

const editedPatient = ref({ ...props.patient });

const saveChanges = async () => {
    try {
        validatePatient(editedPatient.value);
        const updatedPatient = await updatePatient(
            editedPatient.value.id,
            editedPatient.value
        );
        showNotification(toast, updatedPatient.message, "success")
        emit('save', updatedPatient.patient);
        closeDialog();
    } catch (error) {
        showNotification(toast, error.message, "error")
    }
};

const closeDialog = () => {
    emit('update:visible', false);
    emit('close');
};

watch(() => props.patient, (newVal) => {
    editedPatient.value = { ...newVal };
}, { deep: true });
</script>

<template>
    <Toast />
    <Dialog :visible="visible" @update:visible="closeDialog" :style="{ width: '700px' }" header="Edit Patient"
        :modal="true">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">National ID*</label>
                <InputText size="small" v-model="editedPatient.national_id_number" class="w-full" required />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <InputText size="small" v-model="editedPatient.first_name" class="w-full" required />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                <InputText size="small" v-model="editedPatient.last_name" class="w-full" required />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                <Calendar size="small" v-model="editedPatient.date_of_birth" dateFormat="yy-mm-dd" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <Dropdown size="small" v-model="editedPatient.gender" :options="genders" placeholder="Select gender"
                    class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                <InputMask size="small" v-model="editedPatient.phone_number" mask="9999999999" placeholder="1234567890"
                    class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <InputText size="small" v-model="editedPatient.email" type="email" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <Dropdown size="small" v-model="editedPatient.blood_type" :options="bloodTypes"
                    placeholder="Select blood type" class="w-full" />
            </div>
            <div class="">
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <InputText size="small" v-model="editedPatient.address" class="w-full" />
            </div>
        </div>
        <template #footer>
            <div class=" flex justify-end gap-2">
                <Button size="small" label="Cancel" icon="pi pi-times" @click="closeDialog"
                    class="p-button-secondary" />
                <Button size="small" label="Save" icon="pi pi-check" @click="saveChanges" class="p-button-success" />
            </div>
        </template>
    </Dialog>
</template>