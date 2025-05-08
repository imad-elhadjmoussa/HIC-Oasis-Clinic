<template>
  <div class=" bg-white ">
    <h2 class="text-4xl font-semibold text-gray-800 mb-4">
      Latest Fiches
    </h2>

    <div class=" w-full flex    items-center gap-2 mb-4 ">
      <InputText v-model="searchQuery" placeholder="Search Fiche ID..." class="p-inputtext-sm w-full md:w-[50%]" />
    </div>
    <DataTable :value="fiches" paginator :rows="5" class="p-datatable-sm">

      <Column field="id" header="Fiche ID">
        <template #body="{ data }">
          <div class="flex justify-between w-full">
            <span>{{ data.id }}</span>
          </div>
        </template>
      </Column>

      <Column field="created_at" header="Created At">
        <template #body="{ data }">
          <div class="flex justify-between w-full">
            <span>{{ data.created_at }}</span>
          </div>
        </template>
      </Column>

      <Column header="Status">
  <template #body="slotProps">
    <Tag :severity="getTagSeverity(slotProps.data.status)">
      {{ slotProps.data.status }}
    </Tag>
  </template>
</Column>


      <Column header="Actions">
        <template #body="{ data }">
            <router-link :to="`/fiches/ficheId/prestations`">
              <Button icon="pi pi-list" label="View Prestations " class="p-button-sm p-button-info" />
            </router-link>
        </template>
      </Column>

    </DataTable>

    <Dialog v-model:visible="infoDialog" header="Fiche Information" modal>
      <div class="p-fluid flex flex-col px-5 w-[400px]">
        <p><strong>Date:</strong> {{ selectedFiche.created_at }}</p>
        <p><strong>Notes:</strong> {{ selectedFiche.notes }}</p>
        <p><strong>Status:</strong> {{ selectedFiche.status }}</p>
        <div class="mt-4 text-right">
          <Button label="Close" icon="pi pi-times" @click="infoDialog = false" class="p-button-text" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Tag from "primevue/tag";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const searchQuery = ref('');

const fiches = ref([
  { id: "0001/2025", created_at: '2024-03-01', notes: 'Routine checkup', status: 'Completed' },
  { id: "0002/2025", created_at: '2024-03-02', notes: 'X-ray analysis', status: 'Pending' },
  { id: "0003/2025", created_at: '2024-03-03', notes: 'Blood test', status: 'In Progress' },
  { id: "0004/2025", created_at: '2024-03-01', notes: 'Routine checkup', status: 'Completed' },
  { id: "0005/2025", created_at: '2024-03-02', notes: 'X-ray analysis', status: 'Pending' },
  { id: "0006/2025", created_at: '2024-03-03', notes: 'Blood test', status: 'In Progress' }
]);

const filteredFiches = computed(() => {
  return fiches.value.filter(fiche =>
    fiche.id.toString().includes(searchQuery.value)
  );
});

const infoDialog = ref(false);
const selectedFiche = ref({});
const getTagSeverity = (status) => {
  switch (status) {
    case "Completed":
      return "success"; 
    case "In Progress":
      return "info"; 
    case "Pending":
    return 'warn'; 
    
  }
};

const viewFicheDetails = (fiche) => {
  selectedFiche.value = fiche;
  infoDialog.value = true;
};
</script>
