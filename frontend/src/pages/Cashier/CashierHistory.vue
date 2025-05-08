<template>
  <div class="p-6">
    <!-- 🏥 Header with Back Button -->
    <div class="flex items-center justify-between">
      <h3 class="text-[#111418] text-xl font-bold">Historique de paiement</h3>
      <router-link to="/fiches/ficheId/prestations">
        <Button icon="pi pi-arrow-left" class="p-button-sm p-button-rounded p-button-outlined" />
      </router-link>
    </div>

    <!-- 🧑‍⚕️ Patient Info -->
    <div class="mt-4 p-4 bg-gray-100 rounded-lg">
      <h4 class="text-lg font-semibold">Patient: {{ patient.nom }}</h4>
      <p class="text-sm text-gray-600">
        Total Facture: <strong>{{ formatCurrency(patient.totalFacture) }}</strong>
      </p>
    </div>

    <!-- 📊 Payment History Table -->
    <h4 class="mt-6 text-lg font-semibold">Historique des paiements</h4>
    <DataTable :value="patient.paiements" stripedRows responsiveLayout="scroll" class="mt-2">
      <Column field="prestation" header="Prestation"></Column>
      <Column field="date" header="Date de paiement" sortable></Column>
      <Column field="montant" header="Montant Payé (DZD)" sortable>
        <template #body="{ data }">
          {{ formatCurrency(data.montant) }}
        </template>
      </Column>
    </DataTable>
   
    <!-- 💰 Total Remaining -->
    <div class="mt-4 p-4 bg-gray-50 rounded-lg text-right">
      <h4 class="text-lg font-semibold">Part Restante: {{ formatCurrency(partRestante) }}</h4>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

// 📄 Single Patient Data (Optimized Structure)
const patient = ref({
  nom: 'Ahmed Belaid',
  totalFacture: 1200, // Total bill
  paiements: [
    { date: '2024-02-15', montant: 500, prestation: 'Consultation' },
    { date: '2024-03-01', montant: 200, prestation: 'Radiographie' },
  ],
  prestations: [
    { nom: 'Consultation', prix: 300, status: 'Payé' },
    { nom: 'Radiographie', prix: 400, status: 'Non Payé' },
    { nom: 'Chirurgie', prix: 500, status: 'Payé' },
  ],
});

// 💰 Calculate Remaining Payment
const partRestante = computed(() => {
  const totalPaid = patient.value.paiements.reduce((sum, p) => sum + p.montant, 0);
  return Math.max(0, patient.value.totalFacture - totalPaid);
});

// 🏦 Format Currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DZD' }).format(value);
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
