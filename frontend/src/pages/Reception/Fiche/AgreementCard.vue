<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import { formatDate } from '..'
import { getContractDetails } from '../../../api/contract'
import ChangeAgreementDialog from './ChangeAgreementDialog.vue'

const props = defineProps({
    contractId: {
        type: String,
        required: true
    }
})

const contractDetails = ref(null)
const loading = ref(true)
const showDetailsDialog = ref(false)
const showChangeAgreementDialog = ref(false)

const fetchContractDetails = async () => {
    try {
        loading.value = true
        const data = await getContractDetails(props.contractId)
        contractDetails.value = data
    } catch (error) {
        console.error('Error fetching contract details:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchContractDetails()
})

const statusSeverity = computed(() => {
    if (!contractDetails.value?.status) return 'info'
    return contractDetails.value.status === 'Active' ? 'success' : 'danger'
})

const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A'
    return new Intl.NumberFormat('ar-DZ', {
        style: 'currency',
        currency: 'DZD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(price)
}

const emit = defineEmits(['change-agreement'])

const handleAgreementChange = (newAgreement) => {
    emit('change-agreement', newAgreement)
    showChangeAgreementDialog.value = false
    fetchContractDetails()
}

const getAgreementDescription = () => {
    return contractDetails.value?.agreement?.description || 'No description available'
}

const getAgreementDetails = (field) => {
    return contractDetails.value?.agreement_details?.[field] ?? 'N/A'
}

const getAnnexes = () => {
    return contractDetails.value?.annexes || []
}
</script>

<template>
    <div v-if="loading" class="flex justify-center p-4">
        <i class="pi pi-spinner pi-spin text-2xl"></i>
    </div>

    <div v-else-if="contractDetails" class="grid gap-4">
        <!-- Main Contract Card - Simplified -->
        <Card>
            <template #title>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-file"></i>
                        <span class="text-xl font-bold">
                            {{ contractDetails.contract_name || 'Unnamed Contract' }}
                        </span>
                    </div>
                    <Tag :value="contractDetails.status || 'Unknown'" :severity="statusSeverity" />
                </div>
            </template>
            <template #subtitle>
                <div class="text-sm text-gray-600">
                    <span v-if="contractDetails.contract_id">ID: {{ contractDetails.contract_id }}</span>
                    <span v-if="contractDetails.company_id"> | Company ID: {{ contractDetails.company_id }}</span>
                </div>
            </template>
            <template #content>
                <div class="grid gap-3">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Description</p>
                        <p class="line-clamp-2">{{ getAgreementDescription() }}</p>
                    </div>
                    <Button label="View Full Details" icon="pi pi-info-circle" @click="showDetailsDialog = true"
                        class="p-button-text p-button-sm mt-2" />
                </div>
            </template>
            <template #footer>
                <Button label="Change Agreement" icon="pi pi-pencil" @click="showChangeAgreementDialog = true"
                    class="p-button-sm p-button-outlined" />
            </template>
        </Card>

        <!-- Details Dialog with all information -->
        <Dialog v-model:visible="showDetailsDialog" header="Contract Details" :style="{ width: '50vw' }" :modal="true">
            <div class="grid gap-4">
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Contract Name</p>
                        <p>{{ contractDetails.contract_name || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Status</p>
                        <Tag :value="contractDetails.status || 'Unknown'" :severity="statusSeverity" />
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Contract ID</p>
                        <p>{{ contractDetails.contract_id || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Company ID</p>
                        <p>{{ contractDetails.company_id || 'N/A' }}</p>
                    </div>
                </div>

                <Divider />

                <div>
                    <p class="font-bold text-sm text-gray-500 mb-1">Agreement Description</p>
                    <p class="p-3 border-round surface-border border-1">
                        {{ getAgreementDescription() }}
                    </p>
                </div>

                <Divider />

                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Period</p>
                        <p v-if="getAgreementDetails('start_date') && getAgreementDetails('end_date')">
                            {{ formatDate(getAgreementDetails('start_date')) }} -
                            {{ formatDate(getAgreementDetails('end_date')) }}
                        </p>
                        <p v-else>No period specified</p>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Price Range</p>
                        <p>
                            {{ formatPrice(getAgreementDetails('min_price')) }} -
                            {{ formatPrice(getAgreementDetails('max_price')) }}
                        </p>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-gray-500 mb-1">Discount</p>
                        <p>{{ getAgreementDetails('discount_percentage') }}%</p>
                    </div>
                </div>

                <Divider />

                <div v-if="getAnnexes().length > 0">
                    <div class="flex items-center gap-2 mb-2">
                        <p class="font-bold">Annexes</p>
                        <Badge :value="getAnnexes().length" severity="info" />
                    </div>
                    <div class="grid gap-2">
                        <div v-for="annex in getAnnexes()" :key="annex.id"
                            class="p-3 border-round surface-border border-1">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="font-bold">{{ annex.annex_name || 'Unnamed Annex' }}</p>
                                    <Tag v-if="annex.specialty?.name" :value="annex.specialty.name" severity="info"
                                        class="text-sm mt-1" />
                                </div>
                                <span v-if="annex.created_at" class="text-xs text-gray-500">
                                    {{ formatDate(annex.created_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-gray-500">
                    No annexes available for this contract
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" @click="showDetailsDialog = false"
                    class="p-button-secondary" />
            </template>
        </Dialog>

        <!-- Change Agreement Dialog -->
        <ChangeAgreementDialog :visible="showChangeAgreementDialog" :current-agreement="contractDetails.agreement || {}"
            @update:visible="showChangeAgreementDialog = $event" @change-agreement="handleAgreementChange" />
    </div>

    <div v-else class="p-4 text-center text-gray-500">
        No contract details found
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>