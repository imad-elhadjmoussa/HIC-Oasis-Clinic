<script setup>
import { ref, computed, onMounted } from "vue";
import { getUsers } from "./../../api/users.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import AddUserDialog from "./AddUser.vue";
import EditUserDialog from "./EditUser.vue";
import { getRoles } from "../../api/roles.js";

// const roles = ["Admin", "User", "Editor"];
const roles=ref([])
const statusOptions = ["active", "inactive"];

const searchName = ref("");
const searchEmail = ref("");
const searchPhone = ref("");
const searchRole = ref(null);
const users = ref([]);
const toast = useToast();
const visibleEdit = ref(false);
const visibleAdd = ref(false);
const editedUser = ref({});

const fetchUsers = async () => {
    try {
        users.value = await getUsers();
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
        });
    }
};

const fetchRoles = async () => {
    try {
        roles.value = await getRoles();
        
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
        });
    }
};

onMounted(fetchRoles);
onMounted(fetchUsers);

const getTagSeverity = (status) => {
    return status.toLowerCase() === "active" ? "success" : "danger";
};

const openEditDialog = (user) => {
    editedUser.value = { ...user };
    visibleEdit.value = true;
};

// Computed property for filtered users
const filteredUsers = computed(() => {
    return users.value.filter((user) => {
        return (
            (!searchName.value || user.username.toLowerCase().includes(searchName.value.toLowerCase())) &&
            (!searchEmail.value || user.email.toLowerCase().includes(searchEmail.value.toLowerCase())) &&
            (!searchPhone.value || user.phone.includes(searchPhone.value)) &&
            (!searchRole.value || user.role === searchRole.value)
        );
    });
});
</script>

<template>
    <section>
        <Toast />
        <h2 class="header-lg">Users Management</h2>

        <div class="w-full flex justify-end mb-5">
            <Button label="Add User" icon="pi pi-plus" class="p-button-sm p-button-primary"
                @click="visibleAdd = true" />
        </div>

        <!-- Filter Section -->
        <div class="p-grid p-fluid flex gap-3 mb-3">
            <InputText size="small" v-model="searchName" placeholder="Search by Username" class=" w-1/4" />
            <InputText size="small" v-model="searchEmail" placeholder="Search by Email" class=" w-1/4" />
            <InputText size="small" v-model="searchPhone" placeholder="Search by Phone" class=" w-1/4" />
            <Dropdown size="small" v-model="searchRole" :options="roles" placeholder="Select Role" class=" w-1/4" />
        </div>

        <DataTable :value="filteredUsers" paginator :rows="5" class="p-datatable-sm">
            <Column field="username" header="Username" />
            <Column field="email" header="Email" />
            <Column field="phone" header="Phone" />
            <Column field="role" header="Role" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getTagSeverity(data.status)" />
                </template>
            </Column>
            <Column>
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" @click="openEditDialog(data)" class="p-button-sm p-button-outlined" />
                </template>
            </Column>
        </DataTable>

        <AddUserDialog v-model:visible="visibleAdd" @user-added="users.push($event)" />
        <EditUserDialog v-model:visible="visibleEdit" v-model:user="editedUser" @user-updated="fetchUsers" />
    </section>
</template>
