<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const products = [
    { code: 'A1', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: 'A2', name: 'Product 2', category: 'Category 1', quantity: 20 },
    { code: 'A3', name: 'Product 3', category: 'Category 2', quantity: 30 },
    { code: 'A4', name: 'Product 4', category: 'Category 2', quantity: 40 },
    { code: 'A5', name: 'Product 5', category: 'Category 3', quantity: 50 }
];


</script>

<template>
    <div>
        <h1>Home Page</h1>
        <Button label="Click Me" />
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
        </DataTable>
    </div>
</template>