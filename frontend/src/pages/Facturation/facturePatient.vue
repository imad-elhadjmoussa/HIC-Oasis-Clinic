<template>
  <div class="p-6 bg-white shadow-md rounded-md max-w-4xl mx-auto">
    
    <!-- Informations principales -->
    <div class="mb-6 border-b pb-4">
      <p><strong>Nom Entreprise :</strong> {{ facture.entreprise }}</p>
      <p><strong>Nom Patient :</strong> {{ facture.patient }}</p>
      <p><strong>N° Facture :</strong> {{ facture.id }}</p>
      <p><strong>Date Admission :</strong> {{ facture.dateAdmission }}</p>
    </div>
    
    <!-- Tableau des prestations -->
    <DataTable :value="facture.prestations" class="w-full">
      <Column field="prestation" header="Prestation" />
      <Column field="date" header="Date" />
      <Column field="montantHT" header="Montant HT" />
      <Column field="tva" header="TVA" />
      <Column field="ttc" header="TTC" />
    </DataTable>

    <!-- Totaux -->
    <div class="mt-4 p-4 bg-gray-100 rounded-md">
      <p><strong>Total HT :</strong> {{ totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' }) }}</p>
      <p><strong>TVA Totale :</strong> {{ totalTVA.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' }) }}</p>
      <p><strong>Total TTC :</strong> {{ totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' }) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();

// Simuler les données de la facture
const facture = ref({
  id: route.params.id,
  entreprise: "Clinique A",
  patient: "Jean Dupont",
  dateAdmission: "2025-03-24",
  prestations: [
    { prestation: "Consultation", date: "2025-03-20", montantHT: 5000, tva: 500, ttc: 5500 },
    { prestation: "Analyse sanguine", date: "2025-03-21", montantHT: 3000, tva: 300, ttc: 3300 },
    { prestation: "Radiologie", date: "2025-03-22", montantHT: 7000, tva: 700, ttc: 7700 }
  ]
});

// Calcul des totaux
const totalHT = computed(() => facture.value.prestations.reduce((sum, p) => sum + p.montantHT, 0));
const totalTVA = computed(() => facture.value.prestations.reduce((sum, p) => sum + p.tva, 0));
const totalTTC = computed(() => facture.value.prestations.reduce((sum, p) => sum + p.ttc, 0));
</script>

<style scoped>
strong {
  color: #333;
}
</style>
