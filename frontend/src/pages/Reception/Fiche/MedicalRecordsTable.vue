<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    records: {
        type: Array,
        required: true
    }
})


const navigateToDetailsPage = (ficheId) => {
    router.push(`/fiches/${ficheId}`)
}
</script>

<template>
    <DataTable :value="records" :paginator="true" :rows="5" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="id" header="Fiche ID" sortable style="width: 100px"></Column>
        <Column field="patient_name" header="Patient" sortable>
            <template #body="{ data }">
                <div class="font-medium">{{ data.first_name }} {{ data.last_name }}</div>
                <div class="text-sm text-gray-500">ID: {{ data.patient_id }}</div>
            </template>
        </Column>
        <Column field="company_name" header="Company" sortable>
            <template #body="{ data }">
                <div>{{ data.company_name }}</div>
                <div class="text-sm text-gray-500">Contract: {{ data.contract_name }}</div>
            </template>
        </Column>
        <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
                <Button icon="pi pi-eye" label="Details" class="p-button-sm p-button-info"
                    @click="navigateToDetailsPage(data.id)" />
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>