<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Dialog } from 'primevue';
import { InputText } from 'primevue';
import { Calendar } from 'primevue';
import { Dropdown } from 'primevue';
import { Button } from 'primevue';
import { updateDoctor } from '../../api/doctor';

const toast = useToast();
const props = defineProps({
    visible: Boolean,
    doctor: Object,
    specialties: Array
});

const emit = defineEmits(['update:visible', 'update:doctor', 'doctor-updated']);

const editedDoctor = ref({ ...props.doctor });
const loading = ref(false);

watch(() => props.doctor, (newVal) => {
    editedDoctor.value = { ...newVal };
});

const submit = async () => {
    loading.value = true;
    try {
        const data = await updateDoctor(editedDoctor.value.id, editedDoctor.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Doctor updated successfully',
            life: 3000,
        });
        emit('doctor-updated');
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
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Edit Doctor" :modal="true"
        :style="{ width: '600px' }">
        <!-- Same form as AddDoctorDialog but with v-model="editedDoctor" -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Column 1 -->
            <div class="space-y-3">
                <div>
                    <label class="block mb-1">First Name*</label>
                    <InputText size="small" v-model="editedDoctor.first_name" placeholder="Enter first name"
                        class="w-full" required />
                </div>

                <div>
                    <label class="block mb-1">National ID*</label>
                    <InputText size="small" v-model="editedDoctor.national_id_number"
                        placeholder="National identification number" class="w-full" required />
                </div>

                <div>
                    <label class="block mb-1">Phone Number*</label>
                    <InputText size="small" v-model="editedDoctor.phone_number" placeholder="+123 456 7890"
                        class="w-full" required />
                </div>

                <div>
                    <label class="block mb-1">Gender</label>
                    <Dropdown size="small" v-model="editedDoctor.gender" :options="['male', 'female']"
                        placeholder="Select gender" class="w-full" />
                </div>
            </div>

            <!-- Column 2 -->
            <div class="space-y-3">
                <div>
                    <label class="block mb-1">Last Name*</label>
                    <InputText size="small" v-model="editedDoctor.last_name" placeholder="Enter last name"
                        class="w-full" required />
                </div>

                <div>
                    <label class="block mb-1">Date of Birth*</label>
                    <Calendar size="small" v-model="editedDoctor.date_of_birth" dateFormat="yy-mm-dd" class="w-full"
                        :showIcon="true" />
                </div>

                <div>
                    <label class="block mb-1">Email</label>
                    <InputText size="small" v-model="editedDoctor.email" placeholder="example@domain.com"
                        class="w-full" />
                </div>

                <div>
                    <label class="block mb-1">Specialty</label>
                    <Dropdown size="small" v-model="editedDoctor.specialty_id" :options="specialties"
                        optionLabel="specialty_name" optionValue="id" placeholder="Select specialty" class="w-full" />
                </div>
            </div>
        </div>

        <template #footer>
            <Button size="small" label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDialog" />
            <Button size="small" label="Save" icon="pi pi-check" class="p-button-success" @click="submit"
                :loading="loading" />
        </template>
    </Dialog>
</template>