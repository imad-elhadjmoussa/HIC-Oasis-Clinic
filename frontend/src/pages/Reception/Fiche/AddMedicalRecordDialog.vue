<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { createFiche } from '../../../api/medical_record.js'
import { showNotification } from '../index.js'
import { getCompanies } from '../../../api/companies.js'
import { getPatients } from '../../../api/patient.js'

const toast = useToast()
const api_url = import.meta.env.VITE_SERVER_URL

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    medicalRecords: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:visible', 'record-added'])

const newFiche = ref({
    patient_id: "", // Only this field is needed for the API
    company_id: null,
    contract_id: null,
})

// For UI only - not sent to API
const selectedPatientName = ref("")

const companies = ref([])
const contracts = ref([])
const patients = ref([])
const searchTerm = ref("")
const showPatientDropdown = ref(false)

// Computed property for filtered patients
const filteredPatients = computed(() => {
    if (!searchTerm.value) return []
    const term = searchTerm.value.toLowerCase()
    return patients.value.filter(patient =>
        patient.first_name.toLowerCase().includes(term) ||
        patient.last_name.toLowerCase().includes(term) ||
        patient.national_id_number.includes(term) ||
        patient.phone_number.includes(term)
    )
})

const fetchCompanies = async () => {
    try {
        const response = await getCompanies()
        companies.value = response
    } catch (error) {
        showNotification(toast, error.message || 'Failed to fetch companies', 'error')
        companies.value = []
    }
}

const fetchPatients = async () => {
    try {
        patients.value = await getPatients()
    } catch (error) {
        showNotification(toast, error.message || 'Failed to fetch patients', 'error')
        patients.value = []
    }
}

const fetchCompanyContracts = async (companyId) => {
    if (!companyId) {
        contracts.value = []
        newFiche.value.contract_id = null
        return
    }

    try {
        const response = await fetch(`${api_url}/api/contracts/company/${companyId}`)
        if (!response.ok) throw new Error('Failed to fetch contracts')
        contracts.value = await response.json()
    } catch (error) {
        showNotification(toast, error.message || 'Failed to fetch contracts', 'error')
        contracts.value = []
    }
}

// Fetch data when component mounts
onMounted(() => {
    fetchCompanies()
    fetchPatients()
})

// Fetch contracts when company is selected
watch(() => newFiche.value.company_id, fetchCompanyContracts)

const closeDialog = () => {
    emit('update:visible', false)
}

const submitFiche = async () => {
    try {
        // Create payload with only the required fields
        const payload = {
            patient_id: newFiche.value.patient_id,
            company_id: newFiche.value.company_id,
            contract_id: newFiche.value.contract_id
        }

        await createFiche(payload)
        showNotification(toast, 'Fiche created successfully', 'success')
        emit('record-added') // Emit event to parent to refresh records
        closeDialog()
    } catch (error) {
        showNotification(toast, error.message || 'Failed to create fiche', 'error')
    }
}

const resetForm = () => {
    newFiche.value = {
        patient_id: "",
        company_id: null,
        contract_id: null,
    }
    selectedPatientName.value = ""
    searchTerm.value = ""
    contracts.value = []
    showPatientDropdown.value = false
}

const selectPatient = (patient) => {
    newFiche.value.patient_id = patient.id
    selectedPatientName.value = `${patient.first_name} ${patient.last_name} (${patient.national_id_number})`
    searchTerm.value = selectedPatientName.value
    showPatientDropdown.value = false
}

// Reset form when dialog is opened
watch(() => props.visible, (isVisible) => {
    if (isVisible) resetForm()
})
</script>

<template>
    <Dialog :visible="visible" @update:visible="closeDialog" :style="{ width: '600px' }" header="Create New Fiche"
        :modal="true" class="p-fluid">
        <div class="grid">
            <div class="field">
                <label for="patientSearch" class="block text-sm font-medium mb-1">Patient*</label>
                <div class="relative">
                    <InputText id="patientSearch" v-model="searchTerm" class="w-full" size="small" required
                        @focus="showPatientDropdown = true"
                        @blur="setTimeout(() => { showPatientDropdown = false }, 200)"
                        placeholder="Search by name, ID, or phone" />

                    <div v-if="showPatientDropdown && filteredPatients.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div v-for="patient in filteredPatients" :key="patient.id"
                            class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            @mousedown.prevent="selectPatient(patient)">
                            <div class="font-medium">{{ patient.first_name }} {{ patient.last_name }}</div>
                            <div class="text-xs text-gray-500">
                                ID: {{ patient.national_id_number }} | Phone: {{ patient.phone_number }}
                            </div>
                        </div>
                    </div>
                </div>
                <small v-if="newFiche.patient_id" class="text-green-600">Patient selected: {{ selectedPatientName
                    }}</small>
            </div>

            <div class="field">
                <label for="company" class="block text-sm font-medium mb-1">Company</label>
                <Dropdown size="small" id="company" v-model="newFiche.company_id" optionLabel="company_name"
                    :options="companies" optionValue="id" placeholder="Select Company" class="w-full" />
            </div>

            <div class="field">
                <label for="agreement" class="block text-sm font-medium mb-1">Agreement</label>
                <Dropdown size="small" id="agreement" v-model="newFiche.contract_id" :options="contracts"
                    optionLabel="contract_name" optionValue="id" placeholder="Select Agreement" class="w-full"
                    :disabled="!newFiche.company_id" />
                <small v-if="newFiche.company_id && contracts.length === 0" class="text-gray-500">
                    No contracts available for the selected company
                </small>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="closeDialog" class="p-button-secondary" />
            <Button label="Create Fiche" icon="pi pi-check" @click="submitFiche" class="p-button-success"
                :disabled="!newFiche.patient_id" />
        </template>
    </Dialog>
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}

.relative {
    position: relative;
}

.absolute {
    position: absolute;
}

.z-10 {
    z-index: 10;
}

.max-h-60 {
    max-height: 15rem;
}

.overflow-auto {
    overflow: auto;
}
</style>