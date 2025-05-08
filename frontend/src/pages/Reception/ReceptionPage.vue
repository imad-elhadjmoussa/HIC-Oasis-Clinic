<script setup>
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { Toast } from 'primevue';

const router = useRouter();
const toast = useToast();

const logoutUser = async () => {
    try {
        localStorage.removeItem("user");
        toast.add({ severity: "success", summary: "Success", detail: "Logout successful!", life: 3000 });
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } catch (error) {
        toast.add({ severity: "error", summary: "Logout Failed", detail: "Try again", life: 3000 });
    }
};
</script>

<template>
    <Toast />
    <!-- <div class="min-h-screen flex"> -->
        <!-- Sidebar -->
        <!-- <aside class="w-64 bg-gray-900 text-white p-5 space-y-4 min-h-screen">
            <h2 class="text-xl font-semibold">Reception Dashboard</h2>
            <nav class="flex flex-col gap-2">
                <Button @click="router.push('/patients')" label="Patients" icon="pi pi-users" class="w-full" />
                <Button @click="router.push('/appointments')" label="Appointments" icon="pi pi-calendar" class="w-full" />
                <Button @click="router.push('/settings')" label="Settings" icon="pi pi-cog" class="w-full" />
                <Button @click="logoutUser" label="Logout" icon="pi pi-sign-out" class="w-full p-button-danger" />
            </nav>
        </aside> -->

        <!-- Main Content -->
        <main class="flex-1 p-8 bg-gray-100">
            <Card>
                <template #title>Welcome</template>
                <template #content>
                    <p>Welcome to the clinic's reception dashboard. Select an option from the sidebar.</p>
                </template>
            </Card>
        </main>
    <!-- </div> -->
</template>

<style scoped>
.p-button {
    justify-content: start;
}
</style>