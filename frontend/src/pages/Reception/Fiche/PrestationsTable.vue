<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Card from 'primevue/card'
import AddPrestationDialog from './AddPrestationDialog.vue'
import { useRoute } from 'vue-router'
import { getPrestationsMedicalRecord } from '../../../api/medical-record-prestation'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const prestationsMedicalRecord = ref([])
const route = useRoute()
const id = route.params.id
const showAddDialog = ref(false)

const fetchPrestationMedicalRecord = async () => {
    try {
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
    }
}

const handleAddPrestation = (newPrestation) => {
    prestationsMedicalRecord.value = [
        ...prestationsMedicalRecord.value,
        {
            id: Math.max(...prestationsMedicalRecord.value.map(p => p.id), 0) + 1,
            prestation_code: newPrestation.act_code,
            prestation_name: newPrestation.act_name,
            specialty_name: newPrestation.specialty,
            patient_part: newPrestation.unit_price.toString()
        }
    ]
    showAddDialog.value = false
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Medical act added successfully',
        life: 3000
    })
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
                <DataTable :value="prestationsMedicalRecord" class="p-datatable-sm" :paginator="true" :rows="5">
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

    <AddPrestationDialog :prestations="prestationsMedicalRecord" v-model:modelValue="showAddDialog" @add-prestation="handleAddPrestation" />
</template>