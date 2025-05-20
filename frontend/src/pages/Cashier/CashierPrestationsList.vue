<template>
    <div class="parent">
        <!-- Trois cards en haut de page -->
        <div class="cards-container mb-6 w-full">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Card 1: Nombre de prestations -->
                <Card class="shadow-md">
                    <template #title>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold">Prestations</span>
                            <span class="text-xl font-bold">{{ services.length }}</span>
                        </div>
                    </template>
                    <template #content>
                        <div class="flex flex-col items-center">
                            <i class="pi pi-list text-4xl mb-2 text-blue-600"></i>
                            <div class="text-sm text-gray-600 mt-2">
                                Nombre total de prestations
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Card 2: Total facture -->
                <Card class="shadow-md">
                    <template #title>
                        <div class="text-lg font-semibold">Total Facture</div>
                    </template>
                    <template #content>
                        <div class="flex flex-col items-center">
                            <div class="text-xl font-bold text-indigo-600">
                                {{ formatCurrency(totalFacture) }}
                            </div>
                            <div class="mt-2 text-sm text-gray-600">
                                Montant total à facturer
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Card 3: Déjà payé -->
                <Card class="shadow-md">
                    <template #title>
                        <div class="text-lg font-semibold">Déjà Payé</div>
                    </template>
                    <template #content>
                        <div class="flex flex-col items-center">
                            <div class="text-xl font-bold text-green-600">
                                {{ formatCurrency(totalFacture - partRestante) }}
                            </div>
                            <div class="mt-2 text-sm text-gray-600">
                                {{ calculatePaymentPercentage() }}% du montant total
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- Conteneur pour les deux tableaux en parallèle -->
        <div class="tables-container">
            <!-- Partie Liste des Prestations -->
            <div class="div1">
                <h3 class="text-xl font-bold mb-4">Prestation List</h3>
                <DataTable :value="filteredServices" stripedRows paginator :rows="4" responsiveLayout="scroll"
                    class="p-datatable-sm prestation-table">
                    <Column field="prestation_name">
                        <template #header>
                            <div class="flex flex-col">
                                <span>Prestation</span>
                                <InputText v-model="nameFilter" placeholder="Filter by Name"
                                    class="w-full p-inputtext-sm mt-1" />
                            </div>
                        </template>
                        <template #body="{ data }">
                            <div class="prestation-row" :class="{
                                'prestation-paid': isPrestaionFullyPaid(data.id),
                                'prestation-not-paid': !isPrestaionFullyPaid(data.id)
                            }">
                                <span>{{ data.prestation_name }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="price" header="Prix (DZD)">
                        <template #body="{ data }">
                            <div class="flex items-center justify-between w-full gap-2">
                                <span class="flex-1">{{ formatCurrency(data.price) }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column header="Montant à payer (DZD)">
                        <template #body="{ data }">
                            <div class="flex flex-col">
                                <InputNumber v-model="data.amountToPay" mode="currency" currency="DZD"
                                    :max="getRemainingAmount(data.id)" class="w-32"
                                    :disabled="isPrestaionFullyPaid(data.id)" />
                                <small class="text-gray-500 mt-1">
                                    Restant: {{ formatCurrency(getRemainingAmount(data.id)) }}
                                </small>
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <div class="flex justify-end gap-5 items-center mt-4">
                    <div class="flex items-center gap-2">
                        <label class="font-bold">Total Facture:</label>
                        <p class="px-4 py-1 rounded-lg bg-gray-200 text-gray-900">
                            {{ formatCurrency(partRestante) }}
                        </p>
                    </div>
                    <Button label="Payer" icon="pi pi-check-circle" severity="success" class="p-button-sm"
                        @click="validatePayment" :disabled="!hasPendingPayments" />
                </div>

                <!-- Modal édition -->
                <Dialog v-model:visible="isEditModalVisible" modal header="Modifier le prix de la prestation"
                    class="w-full max-w-sm">
                    <div class="p-fluid space-y-4">
                        <div class="mb-4">
                            <label class="font-bold mb-2">Prestation:</label>
                            <p>{{ selectedService?.prestation_name }}</p>
                        </div>
                        <div class="mb-4">
                            <label class="font-bold mb-2">Prix actuel:</label>
                            <p>{{ selectedService ? formatCurrency(selectedService.price) : '' }}</p>
                        </div>
                        <label class="font-bold mb-2">Nouveau prix:</label>
                        <InputNumber ref="priceInput" v-model="editedPrice" mode="currency" currency="DZD"
                            class="w-full" />
                    </div>
                    <template #footer>
                        <Button label="Annuler" icon="pi pi-times" severity="secondary" text
                            @click="isEditModalVisible = false" />
                        <Button label="Enregistrer" icon="pi pi-save" severity="success" @click="saveEdit" />
                    </template>
                </Dialog>
            </div>

            <!-- Partie Historique -->
            <div class="div2">
                <h4 class="text-xl font-bold mb-4">Transaction</h4>
                <DataTable :value="historiquePaiements" stripedRows responsiveLayout="scroll" class="mt-2">
                    <Column field="prestation" header="Prestation" />
                    <Column field="date" header="Date de paiement" />
                    <Column field="montant" header="Montant Payé (DZD)">
                        <template #body="{ data }">{{ formatCurrency(data.montant) }}</template>
                    </Column>
                </DataTable>


            </div>

            <Toast />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const toast = useToast();
const ficheId = parseInt(route.params.ficheId);

// States
const nameFilter = ref('');
const isEditModalVisible = ref(false);
const selectedService = ref(null);
const editedPrice = ref(0);
const priceInput = ref(null);
const services = ref([]);
const historiquePaiements = ref([]);
const remainingAmounts = ref({});

// Fetch prestations
onMounted(async () => {
    await reloadServices();
    await loadHistoriquePaiements();
});

// Computed
const totalFacture = computed(() => services.value.reduce((sum, s) => sum + Number(s.price), 0));
const partRestante = computed(() => {
    const totalPaid = historiquePaiements.value.reduce((sum, p) => sum + Number(p.montant), 0);
    return Math.max(0, totalFacture.value - totalPaid);
});

const isFullyPaid = computed(() => {
    // Convertir explicitement en nombres avant d'additionner
    const totalPaid = historiquePaiements.value.reduce((sum, p) => sum + Number(p.montant), 0);
    return Math.round(totalPaid * 100) >= Math.round(totalFacture.value * 100);
});

const isPrestaionFullyPaid = (prestationId) => {
    const prestationPayments = historiquePaiements.value.filter(p => p.prestation_id === prestationId);

    // Assurez-vous de convertir explicitement en nombres avant d'additionner
    const totalPaid = prestationPayments.reduce((sum, p) => sum + Number(p.montant), 0);

    const service = services.value.find(s => s.id === prestationId);
    if (!service) return false;

    return Math.round(totalPaid * 100) >= Math.round(service.price * 100);
};

const filteredServices = computed(() =>
    services.value.filter(s =>
        s.prestation_name.toLowerCase().includes(nameFilter.value.toLowerCase())
    )
);

const hasPendingPayments = computed(() =>
    services.value.some(s => s.amountToPay > 0 && !isPrestaionFullyPaid(s.id))
);

// Méthode pour calculer le pourcentage de paiement
const calculatePaymentPercentage = () => {
    if (totalFacture.value <= 0) return 0;
    const percentage = ((totalFacture.value - partRestante.value) / totalFacture.value) * 100;
    return percentage.toFixed(0);
};

// Helpers
const getRemainingAmount = (serviceId) => {
    return remainingAmounts.value[serviceId] || 0;
};

// Modal édition
const openEditModal = (service) => {
    if (isPrestaionFullyPaid(service.id)) {
        toast.add({ severity: 'info', summary: 'Information', detail: 'Cette prestation est déjà entièrement payée.', life: 3000 });
        return;
    }

    selectedService.value = service;
    editedPrice.value = service.price;
    isEditModalVisible.value = true;
};

const saveEdit = async () => {
    if (!selectedService.value) return;

    const prestationId = selectedService.value.id;
    let parsedPrice = 0;

    // S'assurer que le prix est un nombre valide
    if (typeof editedPrice.value === 'string') {
        parsedPrice = parseFloat(editedPrice.value.toString().replace(/[^\d.-]/g, '').replace(',', '.'));
    } else {
        parsedPrice = editedPrice.value;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        toast.add({ severity: 'warn', summary: 'Prix invalide', detail: 'Le prix doit être un nombre positif.', life: 3000 });
        return;
    }

    try {
        const res = await axios.put(`http://localhost:5000/api/medical-record-prestations/${prestationId}/price`, {
            price: parsedPrice
        });

        if (res.status === 200) {
            // Mettre à jour le prix dans la liste locale
            selectedService.value.price = parsedPrice;
            toast.add({ severity: 'success', summary: 'Prix mis à jour', detail: 'Le prix a été enregistré.', life: 3000 });
            isEditModalVisible.value = false;

            // Recalculer les montants restants
            await loadHistoriquePaiements();
        } else {
            throw new Error("Erreur lors de la mise à jour");
        }

    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: "Erreur de mise à jour du prix", life: 3000 });
    }
};

// Enregistrer paiements
const validatePayment = async () => {
    const paiementsAEffectuer = services.value.filter(s => s.amountToPay > 0 && !isPrestaionFullyPaid(s.id));

    if (paiementsAEffectuer.length === 0) {
        toast.add({ severity: 'warn', summary: 'Aucun paiement', detail: 'Veuillez saisir un montant à payer', life: 3000 });
        return;
    }

    try {
        for (const service of paiementsAEffectuer) {
            await axios.post('http://localhost:5000/api/paiements', {
                prestation_id: service.id,
                amount_paid: service.amountToPay,
                caisse_id: 1
            });
            service.amountToPay = 0; // Reset après paiement
        }

        toast.add({ severity: 'success', summary: 'Paiements enregistrés', life: 3000 });

        // Reload data
        await reloadServices();
        await loadHistoriquePaiements();

    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de lenregistrement', life: 3000 });
    }
};

const reloadServices = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/medical-record-prestations/fiche/${ficheId}`);
        services.value = res.data.map(p => ({ ...p, amountToPay: 0 })); // Reset amountToPay
    } catch (error) {
        console.error("Erreur chargement services:", error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des prestations', life: 3000 });
    }
};

const loadHistoriquePaiements = async () => {
    try {
        const all = [];
        remainingAmounts.value = {}; // Reset remaining amounts

        for (const s of services.value) {
            try {
                const res = await axios.get(`http://localhost:5000/api/paiements/prestation/${s.id}`);

                // Vérifier le format de la réponse
                if (res.data && res.data.payments) {
                    // Nouveau format d'API
                    res.data.payments.forEach(p => {
                        all.push({
                            prestation: s.prestation_name,
                            prestation_id: s.id, // Ajouter l'ID pour retrouver la prestation
                            date: new Date(p.created_at).toLocaleDateString(),
                            montant: p.amount_paid
                        });
                    });
                    remainingAmounts.value[s.id] = res.data.remainingAmount;
                } else if (Array.isArray(res.data)) {
                    // Ancien format d'API (pour compatibilité)
                    res.data.forEach(p => {
                        all.push({
                            prestation: s.prestation_name,
                            prestation_id: s.id, // Ajouter l'ID pour retrouver la prestation
                            date: new Date(p.created_at).toLocaleDateString(),
                            montant: p.amount_paid
                        });
                    });

                    // Calculer montant restant via les paiements
                    const totalPaid = res.data.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
                    remainingAmounts.value[s.id] = Math.max(0, s.price - totalPaid);
                }
            } catch (error) {
                console.error(`Erreur lors du chargement des paiements pour la prestation ${s.id}:`, error);
            }
        }

        historiquePaiements.value = all;

    } catch (err) {
        console.error("Erreur globale:", err);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Chargement historique échoué', life: 3000 });
    }
};

const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A DZD';
    }
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency', currency: 'DZD'
    }).format(value);
};
</script>

<style>
/* Style global pour l'indicateur des prestations payées */
.prestation-table tr {
    position: relative;
}

.prestation-paid {
    position: relative;
}

.prestation-paid::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: #4CAF50;
}

.prestation-not-paid {
    position: relative;
}

.prestation-not-paid::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: #D46F4D;
}
</style>

<style scoped>
.parent {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.cards-container {
    margin-bottom: 1.5rem;
    width: 100%;
}

/* Conteneur pour les deux tableaux en parallèle */
.tables-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
}

.div1,
.div2 {
    flex: 1;
}

.prestation-row {
    padding: 4px 0;
}
</style>