<template>
    <div class="parent">
        <div class="div1">
            <div>
                <div class="flex items-center justify-between">
                    <h3 class="text-[#111418] text-xl font-bold">Prestation List</h3>
                </div>

                <DataTable :value="filteredServices" stripedRows paginator :rows="4" responsiveLayout="scroll"
                    class="p-datatable-sm">
                    <Column field="code">
                        <template #header>
                            <div class="flex flex-col">
                                <span>Code</span>
                                <InputText v-model="idFilter" placeholder="Filter by ID"
                                    class="w-full p-inputtext-sm mt-1" />
                            </div>
                        </template>
                    </Column>

                    <Column field="name">
                        <template #header>
                            <div class="flex flex-col">
                                <span>Prestation</span>
                                <InputText v-model="nameFilter" placeholder="Filter by Name"
                                    class="w-full p-inputtext-sm mt-1" />
                            </div>
                        </template>
                    </Column>

                    <Column field="price" header="Montant (DZD)">
                        <template #body="{ data }">
                            <div class="flex items-center justify-between w-full gap-2">
                                <span class="flex-1">{{ formatCurrency(data.price - data.amountPaid) }}</span>
                                <Button icon="pi pi-pencil" severity="warn" variant="outlined" class="p-button-sm"
                                    @click="openEditModal(data)" />
                            </div>
                        </template>
                    </Column>

                </DataTable>

                <div class="flex justify-end gap-5 items-center mt-4">
                    <div class="flex items-center gap-2">
                        <label class="font-bold">Total Facture:</label>
                        <p class="px-4 py-1 rounded-lg bg-gray-200 text-gray-900">
                            {{ formatCurrency(totalFacture) }}
                        </p>
                    </div>
                    <Button label="Valider Paiement" icon="pi pi-check-circle" severity="success" class="p-button-sm"
                        @click="validatePayment" />
                </div>
            </div>

            <Dialog v-model:visible="isEditModalVisible" modal header="Modifier le paiement" :closable="true"
                class="w-full max-w-sm">
                <div class="p-fluid">
                    <label for="edit-price" class="font-bold mb-2">Montant payé:</label>
                    <InputNumber ref="priceInput" v-model="newAmountPaid" mode="currency" currency="DZD"
                        class="w-full" />
                </div>
                <template #footer>
                    <Button label="Annuler" icon="pi pi-times" severity="secondary" text
                        @click="isEditModalVisible = false" />
                    <Button label="Enregistrer" icon="pi pi-save" severity="success" @click="saveEdit" />
                </template>
            </Dialog>

            <Toast />
        </div>

        <div class="div2">
            <div class="p-6">
                <h4 class="mt-6 text-lg font-semibold">Historique des paiements</h4>
                <DataTable :value="patient.paiements" stripedRows responsiveLayout="scroll" class="mt-2">
                    <Column field="prestation" header="Prestation"></Column>
                    <Column field="date" header="Date de paiement" sortable></Column>
                    <Column field="montant" header="Montant Payé (DZD)" sortable>
                        <template #body="{ data }">
                            {{ formatCurrency(data.montant) }}
                        </template>
                    </Column>
                    <Column field="totalPrice" header="Prix Total (DZD)">
                        <template #body="{ data }">
                            {{ formatCurrency(data.totalPrice) }}
                        </template>
                    </Column>
                </DataTable>

                <div class="mt-4 p-4 bg-gray-50 rounded-lg text-right">
                    <h4 class="text-lg font-semibold">Part Restante: {{ formatCurrency(partRestante) }}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const idFilter = ref('');
const nameFilter = ref('');
const isEditModalVisible = ref(false);
const selectedService = ref(null);
const newAmountPaid = ref(0);
const priceInput = ref(null);

const services = ref([
    { code: 123, name: 'Consultation', price: 500, amountPaid: 0 },
    { code: 124, name: 'Scanner', price: 1000, amountPaid: 0 },
    { code: 125, name: 'IRM', price: 1200, amountPaid: 0 },
]);

const totalFacture = computed(() =>
    services.value.reduce((total, service) => total + service.price, 0)
);

const totalPaid = computed(() =>
    services.value.reduce((sum, service) => sum + service.amountPaid, 0)
);

const partRestante = computed(() => totalFacture.value - totalPaid.value);

const patient = ref({
    nom: 'Ahmed Belaid',
    paiements: [],
});

const filteredServices = computed(() => {
    return services.value.filter(service =>
        (service.code.toString().includes(idFilter.value) || idFilter.value === '') &&
        (service.name.toLowerCase().includes(nameFilter.value.toLowerCase()) || nameFilter.value === '')
    );
});

const openEditModal = (service) => {
    selectedService.value = service;
    newAmountPaid.value = 0;
    isEditModalVisible.value = true;

    nextTick(() => {
        if (priceInput.value) {
            priceInput.value.$el.focus();
        }
    });
};

const saveEdit = () => {
    if (newAmountPaid.value > (selectedService.value.price - selectedService.value.amountPaid)) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Le montant payé dépasse le montant restant.', life: 3000 });
        return;
    }

    selectedService.value.amountPaid += newAmountPaid.value;

    toast.add({ severity: 'success', summary: 'Montant mis à jour', detail: 'Montant mis à jour avec succès.', life: 3000 });

    isEditModalVisible.value = false;
};

const validatePayment = () => {
    services.value.forEach(service => {
        if (service.amountPaid > 0) { // فقط الخدمات التي تم الدفع لها
            patient.value.paiements.push({
                date: new Date().toISOString().split('T')[0],
                montant: service.amountPaid,
                prestation: service.name,
                totalPrice: service.price // نضيف السعر الكلي للخدمة
            });
        }
    });

    toast.add({
        severity: 'success',
        summary: 'Paiement validé',
        detail: 'Paiement enregistré avec succès.',
        life: 3000
    });
};



const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DZD' }).format(value);
};
</script>


<style scoped>
.parent {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 8px;
}

.div1 {
    grid-column: span 3 / span 3;
    grid-row: span 5 / span 5;
}

.div2 {
    grid-column: span 3 / span 3;
    grid-row: span 5 / span 5;
    grid-column-start: 4;
}
</style>
