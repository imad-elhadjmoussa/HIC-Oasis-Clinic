<template>
    <div class="card p-4">
      <!-- Sélecteur des factures validées -->
      <div class="flex justify-center mb-4">
        <TreeSelect 
          v-model="selectedFactures" 
          :options="factureOptions" 
          selectionMode="checkbox" 
          placeholder="Sélectionner des factures"
          class="w-full md:w-[90%] lg:w-[80%] border p-2 rounded-md"
          @change="ajouterFacturesAuTableau"
        />
      </div>
  
      <!-- Tableau des factures sélectionnées -->
      <DataTable :value="selectedFacturesTable" tableStyle="min-width: 50rem">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Bordereau</span>
          </div>
        </template>
  
        <Column field="nomAssure" header="Nom Assuré">
          <template #body="{ data }">{{ data.nomAssure }}</template>
        </Column>
  
        <Column field="invoiceNumber" header="N° Facture">
          <template #body="{ data }">{{ data.invoiceNumber }}</template>
        </Column>
  
        <Column field="amount" header="Montant">
          <template #body="{ data }">{{ formatCurrency(data.amount) }}</template>
        </Column>
  
        <Column field="examenee" header="Examinée">
          <template #body="{ data }">{{ data.examenee }}</template>
        </Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import TreeSelect from 'primevue/treeselect';
  import { useRoute } from 'vue-router';
  
  // ✅ Récupérer les factures validées passées via props (depuis `patient.vue`)
  const route = useRoute();
  const facturesValidees = ref(route.params.facturesValidees || []);
  
  // ✅ Convertir les factures validées en options pour `TreeSelect`
  const factureOptions = computed(() =>
    facturesValidees.value.map((facture, index) => ({
      key: index.toString(),
      label: `Facture ${facture.invoiceNumber} - ${facture.nomAssure}`,
      data: facture,
    }))
  );
  
  // ✅ Liste des factures sélectionnées dans `TreeSelect`
  const selectedFactures = ref([]);
  
  // ✅ Tableau des factures ajoutées
  const selectedFacturesTable = ref([]);
  
  // ✅ Fonction pour ajouter les factures sélectionnées au tableau
  const ajouterFacturesAuTableau = () => {
    selectedFacturesTable.value = selectedFactures.value.map(key => {
      return factureOptions.value.find(option => option.key === key)?.data;
    }).filter(facture => facture); // Supprime les valeurs `null`
  };
  
  // ✅ Fonction de formatage de la monnaie
  const formatCurrency = (value) => {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' });
  };
  </script>
  