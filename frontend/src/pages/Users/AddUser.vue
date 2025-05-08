<script setup>
import { ref, defineEmits } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import { createUser } from "./../../api/users.js";

const roles = ["Admin", "Reception","Cashier","Facturation"];
const statusOptions = ["active", "inactive"];

const visible = defineModel("visible");
const newUser = ref({
    username: "",
    email: "",
    phone: "",
    role: "User",
    status: "active",
    password: "",
});

const toast = useToast();
const emit = defineEmits(["user-added"]);

const addUser = async () => {
    try {
        const createdUser = await createUser(newUser.value);
        emit("user-added", createdUser.user);
        toast.add({
            severity: "success",
            summary: "Success",
            detail: createdUser.message,
            life: 3000,
        });
        // Reset form
        newUser.value = { username: "", email: "", phone: "", password: "", role: "User", status: "active" };
        visible.value = false;
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" class="w-full max-w-[600px]" header="Add User" modal>
        <form class="p-fluid flex flex-col px-5">
            <label>Username:</label>
            <InputText size="small" v-model="newUser.username" />

            <label class="mt-3">Email:</label>
            <InputText size="small" v-model="newUser.email" />

            <label class="mt-3">Phone:</label>
            <InputText size="small" v-model="newUser.phone" />

            <label class="mt-3">Password:</label>
            <InputText size="small" v-model="newUser.password" />

            <label class="mt-3">Role:</label>
            <Dropdown size="small" v-model="newUser.role" :options="roles" class="w-full" />

            <label class="mt-3">Status:</label>
            <Dropdown size="small" v-model="newUser.status" :options="statusOptions" class="w-full" />

            <div class="mt-4 flex gap-3">
                <Button size="small" class="flex-1" label="Cancel" severity="secondary" icon="pi pi-times" @click="visible = false" />
                <Button size="small" label="Save" icon="pi pi-check" @click="addUser" class="p-button-primary flex-1" />
            </div>
        </form>
    </Dialog>
</template>
