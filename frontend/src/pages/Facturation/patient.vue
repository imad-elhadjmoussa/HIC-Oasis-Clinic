<template>
  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Liste des Factures</span>
          <Button label="Borderau" icon="pi pi-book" class="p-button-sm" @click="allerVersBorderau" />

        </div>
      </template>

      <Column field="borderauNumber">
        <template #header>
          <div class="flex flex-col">
            <span>N° Borderau</span>
            <InputText v-model="filters.borderauNumber" placeholder="Filter by N° Borderau"
              class="w-full p-inputtext-sm mt-1" />
          </div>
        </template>
        <template #body="{ data }">{{ data.borderauNumber || 'N/A' }}</template>
      </Column>

      <Column field="invoiceNumber">
        <template #header>
          <div class="flex flex-col">
            <span>N° Facture</span>
            <InputText v-model="filters.invoiceNumber" placeholder="Filter by N° Facture"
              class="w-full p-inputtext-sm mt-1" />
          </div>
        </template>
        <template #body="{ data }">{{ data.invoiceNumber || 'N/A' }}</template>
      </Column>

      <Column field="patient" header="Patient">
        <template #body="{ data }">{{ data.patient }}</template>
      </Column>

      <Column field="amount" header="Montant">
        <template #body="{ data }">{{ formatCurrency(data.amount) }}</template>
      </Column>

      <Column header="Status">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <Button icon="pi pi-list" label="Générer" class="p-button-sm p-button-info" @click="openFactureModal(data)" />
        </template>
      </Column>
    </DataTable>

    <!-- Fenêtre modale pour afficher la facture -->
    <Dialog v-model:visible="showFactureModal" modal header="Détails de la Facture" :style="{ width: '50vw' }">
      <patientF :facture="selectedFacture" />
      <template #footer>
        <Button label="Générer la facture" icon="pi pi-check" class="p-button-sm p-button-success"
          @click="validateFacture" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from "primevue/tag";
import Dialog from 'primevue/dialog';
import patientF from './facturePatient.vue';

const router = useRouter();
const facturesValidees = ref([]);

const products = ref([
  { borderauNumber: "N/A", invoiceNumber: null, patient: "Jean Dupont", amount: 150.0, status: "en attente" },
  { borderauNumber: "N/A", invoiceNumber: null, patient: "Marie Curie", amount: 200.5, status: "en attente" },
  { borderauNumber: "N/A", invoiceNumber: null, patient: "Albert Einstein", amount: 300.75, status: "en attente" }
]);

const filters = ref({ borderauNumber: '', invoiceNumber: '' });
const showFactureModal = ref(false);
const selectedFacture = ref(null);
const invoiceCounter = ref(1); 

const formatCurrency = (value) => {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' });
};

const getSeverity = (status) => {
  switch (status) {
    case 'facturée':
      return 'success';
    case 'validée':
      return 'warn';
    case 'en attente':
      return 'danger';
    default:
      return null;
  }
};

const validateFacture = () => {
  if (selectedFacture.value) {
    const year = new Date().getFullYear();
    const newInvoiceNumber = String(invoiceCounter.value).padStart(4, '0') + '/' + year;
    
    selectedFacture.value.invoiceNumber = newInvoiceNumber;
    selectedFacture.value.status = "validée";
    selectedFacture.value.borderauNumber = "N/A";

    invoiceCounter.value++;

    // Ajouter la facture validée à la liste
    facturesValidees.value.push({ ...selectedFacture.value }); // Copier l'objet pour éviter les références

    showFactureModal.value = false;
  }
};

const openFactureModal = (facture) => {
  selectedFacture.value = facture;
  showFactureModal.value = true;
};

const allerVersBorderau = () => {
  if (facturesValidees.value.length > 0) {
    router.push({ 
      name: 'Borderau', 
      query: { factures: JSON.stringify(facturesValidees.value) } // Utilisation de query
    });
  } else {
    console.warn("Aucune facture validée !");
  }
};
</script>

