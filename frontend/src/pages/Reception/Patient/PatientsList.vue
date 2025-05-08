<script setup>
import { ref, computed, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { RouterLink } from "vue-router";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import AddPatientModel from "./AddPatientModel.vue";
import { getPatients } from "../../../api/patient";
import { formatDate, showNotification } from "..";

const toast = useToast();
const patients = ref([]);
const searchTerm = ref("");
const addPatientDialog = ref(false);
const filterField = ref('all'); // Default filter field

const filterOptions = ref([
    { label: 'All Fields', value: 'all' },
    { label: 'National ID', value: 'national_id_number' },
    { label: 'Phone Number', value: 'phone_number' },
    { label: 'Full Name', value: 'name' }
]);

const fetchPatients = async () => {
    try {
        const response = await getPatients();
        patients.value = response;
    } catch (error) {
        showNotification(toast, error.message || 'Failed to fetch patients', 'error');
    }
};

onMounted(async () => {
    await fetchPatients();
});

// Computed properties
const filteredPatients = computed(() => {
    let result = patients.value;
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();

        if (filterField.value === 'all') {
            result = result.filter(patient =>
                `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(term) ||
                patient.national_id_number.includes(term) ||
                patient.phone_number.includes(term) ||
                patient.email?.toLowerCase().includes(term)
            );
        } else if (filterField.value === 'name') {
            result = result.filter(patient =>
                `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(term)
            );
        } else if (filterField.value === 'national_id_number') {
            result = result.filter(patient =>
                patient.national_id_number.includes(term)
            );
        } else if (filterField.value === 'phone_number') {
            result = result.filter(patient =>
                patient.phone_number.includes(term)
            );
        }
    }
    return result;
});
</script>

<template>
    <div class=" ">
        <Toast position="top-right" />

        <Card>
            <template #title>
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-800">Patient List</h1>
                </div>
            </template>

            <template #content>
                <div class="flex flex-col sm:flex-row items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div class="relative flex-1 w-full flex gap-2">
                        <Dropdown size="small" v-model="filterField" :options="filterOptions" optionLabel="label"
                            optionValue="value" class="w-40" />
                        <InputText class="w-full" size="small" v-model="searchTerm"
                            :placeholder="`Search by ${filterOptions.find(f => f.value === filterField)?.label.toLowerCase()}...`" />
                    </div>
                    <Button label="Add Patient" size="small" icon="pi pi-user-plus" @click="addPatientDialog = true"
                        class="p-button-primary w-full sm:w-auto" />
                </div>

                <DataTable :value="filteredPatients" :paginator="true" :rows="5" responsiveLayout="scroll"
                    class="p-datatable-sm">
                    <Column field="national_id_number" header="National ID" sortable></Column>
                    <Column field="name" header="Full Name" sortable>
                        <template #body="{ data }">
                            {{ data.first_name }} {{ data.last_name }}
                        </template>
                    </Column>
                    <Column field="phone_number" header="Phone" sortable></Column>
                    <Column field="date_of_birth" header="Date of Birth" sortable>
                        <template #body="{ data }">
                            {{ formatDate(data.date_of_birth) }}
                        </template>
                    </Column>

                    <Column header="Actions" style="width: 180px">
                        <template #body="{ data }">
                            <RouterLink :to="`/patients/${data.id}`">
                                <Button icon="pi pi-eye" size="small" severity="info" label="Details" />
                            </RouterLink>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>

        <!-- Dialogs -->
        <AddPatientModel v-model:visible="addPatientDialog" :patients="patients" />
    </div>
</template>

<style scoped></style>