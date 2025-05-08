<template>
    <header class=" py-2 border-b-[1px] border-gray-200  ">
        <nav class="container flex items-center justify-between ">
            <img src="../assets/logo.jpg" alt="Clinique Logo" class="w-13 h-13 rounded-full" />
            <Button label="Logout" severity="danger" @click="logoutUser(toast)" />
        </nav>
    </header>
    <div class=" container !my-4 ">
        <Toast />
        <RouterView />
    </div>
</template>

<script setup>
import { Button, Toast, useToast } from 'primevue';
import { RouterView } from 'vue-router';
import { logoutUser } from '../api/auth';

const toast=useToast();

</script>

<style scoped >
.container{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}
</style>