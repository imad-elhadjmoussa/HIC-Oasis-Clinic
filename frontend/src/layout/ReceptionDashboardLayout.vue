<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Toast from "primevue/toast";

const isCollapsed = ref(true);
const router = useRouter();
const toast = useToast();

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};

const menuItems = [
    { label: "Dashboard", icon: "pi pi-home", route: "/" },
    { label: "Patients", icon: "pi pi-users", route: "/patients" },
    { label: "Fiches", icon: "pi pi-calendar", route: "/fiches" },
    { label: "Settings", icon: "pi pi-cog", route: "/settings" },
    { label: "Logout", icon: "pi pi-sign-out", action: "logout" }
];

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

    <div :class="isCollapsed ? 'w-[80px]' : 'w-[250px]'"
        class="h-screen z-20 bg-gray-900 text-white fixed bottom-0 top-0 left-0 transition-all duration-300 flex flex-col p-4">

        <div class="flex items-center justify-between mb-6">
            <img @click="toggleSidebar" class="w-10 h-10 rounded-full cursor-pointer" src="./../assets/logo.jpg"
                alt="Logo">
            <Button v-if="!isCollapsed" @click="toggleSidebar" icon="pi pi-times" severity="danger" variant="text"
                rounded aria-label="Cancel" />
        </div>

        <ul class="space-y-2">
            <template v-for="(item, index) in menuItems" :key="index">
                <li v-if="item.action === 'logout'" @click="logoutUser"
                    class="flex items-center gap-3 py-2 px-4 text-md rounded-md hover:bg-red-600 cursor-pointer transition">
                    <i :class="item.icon"></i>
                    <span v-if="!isCollapsed">{{ item.label }}</span>
                </li>

                <router-link v-else :to="item.route"
                    class="flex items-center gap-3 py-2 px-4 text-md rounded-md hover:bg-gray-800 transition">
                    <i :class="item.icon"></i>
                    <span v-if="!isCollapsed">{{ item.label }}</span>
                </router-link>
            </template>
        </ul>
    </div>

    <div :class="isCollapsed ? 'ml-[80px] w-[calc(100%-80px)]' : 'ml-[250px] w-[calc(100%-250px)]'"
        class="transition-all min-h-screen bg-gray-50 px-5 py-6 ">
        <RouterView />
    </div>
</template>

<style scoped>
.transition-all {
    transition: all 0.3s ease-in-out;
}
</style>