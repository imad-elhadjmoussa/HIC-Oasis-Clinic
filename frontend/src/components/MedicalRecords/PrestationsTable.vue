<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Card from 'primevue/card'
import { useRoute } from 'vue-router'
import { getPrestationsMedicalRecord } from '../../api/medical-record-prestation'
import { useToast } from 'primevue/usetoast'
import AddPrestationDialog from './AddPrestationDialog.vue'

const toast = useToast()
const prestationsMedicalRecord = ref([])
const route = useRoute()
const id = route.params.id
const showAddDialog = ref(false)
const loading = ref(false) // Add loading state

const emit = defineEmits(["refresh"])

const fetchPrestationMedicalRecord = async () => {
    try {
        loading.value = true
        const data = await getPrestationsMedicalRecord(id)
        prestationsMedicalRecord.value = data
    } catch (error) {
        console.error("Error fetching medical record:", error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

const handleAddPrestation = async () => {
    await fetchPrestationMedicalRecord()
    showAddDialog.value = false
    emit("refresh")
}

onMounted(() => {
    fetchPrestationMedicalRecord()
})
</script>

<template>
    <div class="grid gap-4">
        <Card>
            <template #title>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-list"></i>
                        <span>Medical Record Acts</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Badge :value="prestationsMedicalRecord.length" severity="info" />
                        <Button label="Add Medical Act" icon="pi pi-plus" @click="showAddDialog = true"
                            class="p-button-primary p-button-sm" />
                    </div>
                </div>
            </template>
            <template #content>
                <!-- Loading state -->
                <div v-if="loading" class="flex justify-center p-4">
                    <i class="pi pi-spinner pi-spin text-2xl"></i>
                </div>

                <!-- Empty state -->
                <div v-else-if="prestationsMedicalRecord.length === 0"
                    class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-600 mb-2">No Medical Acts Found</h3>
                    <p class="text-gray-500 text-center mb-4">This medical record doesn't have any acts yet.</p>
                    <Button label="Add First Act" icon="pi pi-plus" @click="showAddDialog = true"
                        class="p-button-sm p-button-primary" />
                </div>

                <!-- Data table -->
                <DataTable v-else :value="prestationsMedicalRecord" class="p-datatable-sm" :paginator="true" :rows="5">
                    <Column field="id" header="ID" style="width: 100px"></Column>
                    <Column field="prestation_code" header="Code" style="width: 100px"></Column>
                    <Column field="prestation_name" header="Act Name"></Column>
                    <Column field="specialty_name" header="Specialty"></Column>
                    <Column header="Patient Part" style="width: 120px">
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.patient_part }} DA</span>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>

    <AddPrestationDialog :prestations="prestationsMedicalRecord" v-model:modelValue="showAddDialog"
        @add-prestation="handleAddPrestation" />
</template>