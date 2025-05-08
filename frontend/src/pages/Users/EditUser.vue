<script setup>
import { ref, defineEmits } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import { updateUser } from "./../../api/users.js";

const roles = ["Admin", "Reception"];
const statusOptions = ["active", "inactive"];

const visible = defineModel("visible");
const editedUser = defineModel("user");

const toast = useToast();
const emit = defineEmits(["user-updated"]);

const saveUser = async () => {
    try {
        const userUpdated = await updateUser(editedUser.value.user_id, editedUser.value);
        emit("user-updated", userUpdated.user);

        toast.add({
            severity: "success",
            summary: "Success",
            detail: userUpdated.message,
            life: 3000,
        });

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
    <Dialog v-model:visible="visible" class="w-full max-w-[600px]" header="Edit User" modal>
        <form class="p-fluid flex flex-col px-5">
            <label>Name:</label>
            <InputText size="small" v-model="editedUser.username" />

            <label class="mt-3">Email:</label>
            <InputText size="small" v-model="editedUser.email" />

            <label class="mt-3">Phone:</label>
            <InputText size="small" v-model="editedUser.phone" />

            <label class="mt-3">Role:</label>
            <Dropdown size="small" v-model="editedUser.role" :options="roles" class="w-full" />

            <label class="mt-3">Status:</label>
            <Dropdown size="small" v-model="editedUser.status" :options="statusOptions" class="w-full" />

            <div class="mt-4 flex gap-3">
                <Button class="flex-1" size="small" label="Cancel" severity="secondary" icon="pi pi-times" @click="visible = false" />
                <Button size="small" label="Save" icon="pi pi-check" @click="saveUser" class="p-button-primary flex-1" />
            </div>
        </form>
    </Dialog>
</template>
