<template>
  
  <div class="bg-white p-6 mx-auto w-full">
    <h2 class="text-4xl font-semibold text-gray-800 mb-4">Facture</h2>
    
    <!-- 📋 Data Table -->
    <DataTable :value="filteredFiches" paginator :rows="5" class="w-full">
      <!-- 🏢 Entreprise Column with Filter -->
      <Column field="entreprise">
        <template #header>
          <div class="flex flex-col">
            <span>Entreprise</span>
            <InputText v-model="entrepriseFilter" placeholder="Filter by Entreprise" class="w-full p-inputtext-sm mt-1" />
          </div>
        </template>
        <template #body="{ data }">
          <span>{{ data.entreprise }}</span>
        </template>
      </Column>

      <!-- 📊 Nbr Act Non Facture Column with Filter -->
      <Column field="nbrActNonFacture" >
        <template #header>
          <div class="flex flex-col">
            <span>Nbr Patient Non Facturé</span>
            <InputText v-model="nbrActNonFactureFilter" placeholder="Filter by Number" class="w-full p-inputtext-sm mt-1" />
          </div>
        </template>
        <template #body="{ data }">
          <span>{{ data.nbrActNonFacture }}</span>
        </template>
      </Column>
      
      <Column header="Actions" style="width: 50%">
        <template #body="{ data }">
          <div class="flex gap-2">
            <router-link :to="`/patient`">
              <Button icon="pi pi-list" label="Facture" class="p-button-sm p-button-info" />
            </router-link>
            <router-link :to="`/fiches/${data.id}/prestations/history`">
              <Button label="Proformat" icon="pi pi-calendar" class="p-button-sm" />
            </router-link>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const entrepriseFilter = ref('');
const nbrActNonFactureFilter = ref('');

const fiches = ref([
  { id: "0001/2025", entreprise: "Clinique A", nbrActNonFacture: 2 },
  { id: "0002/2025", entreprise: "Clinique B", nbrActNonFacture: 5 },
  { id: "0003/2025", entreprise: "Clinique C", nbrActNonFacture: 3 },
  { id: "0004/2025", entreprise: "Clinique A", nbrActNonFacture: 1 },
  { id: "0005/2025", entreprise: "Clinique B", nbrActNonFacture: 4 },
  { id: "0006/2025", entreprise: "Clinique C", nbrActNonFacture: 2 }
]);

const filteredFiches = computed(() => {
  return fiches.value.filter(fiche =>
    fiche.entreprise.toLowerCase().includes(entrepriseFilter.value.toLowerCase()) &&
    fiche.nbrActNonFacture.toString().includes(nbrActNonFactureFilter.value)
  );
});
</script>

<style scoped>
.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.75rem 0.5rem;
}

.p-datatable .p-datatable-thead > tr > th,
.p-datatable .p-datatable-tbody > tr > td {
  font-size: 1rem;
}
</style>
