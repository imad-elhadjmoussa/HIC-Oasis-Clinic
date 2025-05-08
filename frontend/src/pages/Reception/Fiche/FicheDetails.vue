<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import PatientInfoCard from './PatientInfoCard.vue'
import SummaryCard from './SummaryCard.vue'
import AgreementCard from './AgreementCard.vue'
import PrestationsTable from './PrestationsTable.vue'
import AddPrestationDialog from './AddPrestationDialog.vue'
import ChangeAgreementDialog from './ChangeAgreementDialog.vue'
import ValidatePrestationDialog from './ValidatePrestationDialog.vue'
import { formatDate } from '..'
import { getMedicalRecord } from '../../../api/medical_record'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id
const medicalRecord = ref(null)
const loading = ref(true)

const fetchMedicalRecord = async () => {
    try {
        const data = await getMedicalRecord(id)
        medicalRecord.value = data
        loading.value = false
    } catch (error) {
        console.error("Error fetching medical record:", error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000
        })
        loading.value = false
    }
}

onMounted(async () => {
    await fetchMedicalRecord()
})

const ficheStatusSeverity = (status) => {
    switch (status) {
        case 'Completed': return 'success'
        case 'Partial': return 'warning'
        case 'Pending': return 'info'
        case 'Rejected': return 'danger'
        default: return null
    }
}

const openValidateDialog = (prestation) => {
    prestationToValidate.value = prestation
    validateDialog.value = true
}

const validatePrestation = () => {
    prestationToValidate.value.status = "Validated"
    prestationToValidate.value.validated_by = "Current User"
    prestationToValidate.value.validated_at = new Date().toLocaleString()

    if (fiche.value.prestations.every(p => p.status === "Validated")) {
        fiche.value.status = "Completed"
    } else {
        fiche.value.status = "Partial"
    }

    validateDialog.value = false
    toast.add({
        severity: 'success',
        summary: 'Validated',
        detail: 'Medical act validated successfully',
        life: 3000
    })
}
</script>

<template>
    <div class="container mx-auto">
        <Toast position="top-right" />

        <div class="mb-6 flex justify-between items-center">
            <div class="flex justify-between items-start mt-2">
                <h1 class="text-2xl font-bold">Medical Record #{{ medicalRecord?.id }}</h1>
            </div>
            <Button label="Back to List" icon="pi pi-arrow-left" size="small" severity="secondary"
                @click="router.push('/fiches-navait')" />
        </div>

        <!-- Patient and Agreement Info -->
        <div class=" mb-5">
            <SummaryCard v-if="medicalRecord" :total-prestations="medicalRecord.prestation_count"
                :total-amount="medicalRecord.total_patient_part" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PatientInfoCard v-if="medicalRecord" :patientId="medicalRecord.patient_id" />
            <AgreementCard v-if="medicalRecord" :contractId="medicalRecord.contract_id" />
        </div>

        <div class="flex flex-col gap-6">

            <!-- Medical Acts Table -->
            <PrestationsTable v-if="medicalRecord" :prestations="[]" @validate="openValidateDialog" />
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-8">
            <ProgressSpinner />
        </div>
    </div>
</template>

<style scoped></style>