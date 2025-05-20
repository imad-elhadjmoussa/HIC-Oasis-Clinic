<script setup>
import { ref, watchEffect } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Dialog } from 'primevue';
import { InputText } from 'primevue';
import { Calendar } from 'primevue';
import { Dropdown } from 'primevue';
import { Button } from 'primevue';
import { createDoctor } from '../../api/doctor';


const toast = useToast();
const props = defineProps({
    visible: Boolean,
    specialties: Array
});

const emit = defineEmits(['update:visible', 'doctor-created']);

const doctor = ref({
    first_name: '',
    last_name: '',
    national_id_number: '',
    date_of_birth: '',
    phone_number: '',
    email: '',
    gender: null,
    specialty_id: null
});

const loading = ref(false);

const submit = async () => {
    loading.value = true;
    try {
        const data = await createDoctor(doctor.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Doctor created successfully',
            life: 3000,
        });
        emit('doctor-created');
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
    doctor.value = {
        first_name: '',
        last_name: '',
        national_id_number: '',
        date_of_birth: '',
        phone_number: '',
        email: '',
        gender: null,
        specialty_id: null
    };
    emit('update:visible', false);
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="$emit('update:visible', $event)" header="Add New Doctor" :modal="true"
        :style="{ width: '600px' }">
        <div class="grid grid-cols-2 gap-4">
            <!-- Column 1 -->
            <div class="space-y-3">
                <div>
                    <label class="block mb-1">First Name*</label>
                    <InputText size="small" v-model="doctor.first_name" placeholder="Enter first name" class="w-full"
                        required />
                </div>

                <div>
                    <label class="block mb-1">National ID*</label>
                    <InputText size="small" v-model="doctor.national_id_number"
                        placeholder="National identification number" class="w-full" required />
                </div>

                <div>
                    <label class="block mb-1">Phone Number*</label>
                    <InputText size="small" v-model="doctor.phone_number" placeholder="+123 456 7890" class="w-full"
                        required />
                </div>

                <div>
                    <label class="block mb-1">Gender</label>
                    <Dropdown size="small" v-model="doctor.gender" :options="['male', 'female']"
                        placeholder="Select gender" class="w-full" />
                </div>
            </div>

            <!-- Column 2 -->
            <div class="space-y-3">
                <div>
                    <label class="block mb-1">Last Name*</label>
                    <InputText size="small" v-model="doctor.last_name" placeholder="Enter last name" class="w-full"
                        required />
                </div>

                <div>
                    <label class="block mb-1">Date of Birth*</label>
                    <Calendar size="small" v-model="doctor.date_of_birth" dateFormat="yy-mm-dd" class="w-full"
                        :showIcon="true" />
                </div>

                <div>
                    <label class="block mb-1">Email</label>
                    <InputText size="small" v-model="doctor.email" placeholder="example@domain.com" class="w-full" />
                </div>

                <div>
                    <label class="block mb-1">Specialty</label>
                    <Dropdown size="small" v-model="doctor.specialty_id" :options="specialties"
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