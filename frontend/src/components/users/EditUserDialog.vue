<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import { updateUser } from "./../../api/users.js";
import { specialties } from "../../pages/Reception/index.js";
import DatePicker from 'primevue/datepicker';

import { formatDateToDDMMYYYY,isoToDDMMYYYY } from "./index.js";

const props = defineProps({
    visible: Boolean,
    user: {
        type: Object,
        default: () => ({}),
    },
    roles: {
        type: Array,
        default: () => [],
    },
});


const statusOptions = ["active", "inactive"];
const genderOptions = ["male", "female"];

const emit = defineEmits(["update:visible", "user-updated"]);
const toast = useToast();

const editedUser = ref({
    first_name: "",
    last_name: "",
    national_id_number: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    gender: "",
    role_id: "",
    specialty_id: "",
    status: "active",
    password: "",
});

console.log(props.user);

// Watch for changes in the props.user and update the form
watch(
    () => props.user,
    (newUser) => {
        if (newUser) {
            editedUser.value = {
                ...newUser,
                date_of_birth: isoToDDMMYYYY(newUser.date_of_birth),
                // Ensure we don't overwrite password unless explicitly changing it
                password: "",
            };
        }
    },
    { immediate: true, deep: true }
);

const updateUserHandler = async () => {
    try {
        // Only include password if it was changed
        const userToUpdate = { ...editedUser.value };
        if (!userToUpdate.password) {
            delete userToUpdate.password;
        }

        const updatedUser = await updateUser(props.user.id, userToUpdate);
        emit("user-updated");
        toast.add({
            severity: "success",
            summary: "Success",
            detail: updatedUser.message,
            life: 3000,
        });
        emit("update:visible", false);
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
    <Dialog :visible="visible" @update:visible="(val) => emit('update:visible', val)" class="w-full max-w-[700px]"
        header="Edit User" modal>
        <form class="p-fluid flex flex-col px-5 gap-3" @submit.prevent="updateUserHandler">
            <div class="grid grid-cols-2 gap-4">
                <!-- Column 1 -->
                <div class="space-y-3">
                    <div>
                        <label class="block mb-1">First Name*</label>
                        <InputText size="small" v-model="editedUser.first_name" placeholder="Enter first name"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">National ID*</label>
                        <InputText size="small" v-model="editedUser.national_id_number"
                            placeholder="National identification number" class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Phone Number*</label>
                        <InputText size="small" v-model="editedUser.phone_number" placeholder="+123 456 7890"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Gender</label>
                        <Dropdown size="small" v-model="editedUser.gender" :options="genderOptions"
                            placeholder="Select gender" class="w-full" />
                    </div>

                    <div>
                        <label class="block mb-1">Specialty</label>
                        <Dropdown size="small" v-model="editedUser.specialty_id" :options="specialties"
                            optionLabel="specialty_name" optionValue="id" placeholder="Select specialty" class="w-full"
                            :disabled="editedUser.role !== 'Manager'" />
                    </div>
                </div>

                <!-- Column 2 -->
                <div class="space-y-3">
                    <div>
                        <label class="block mb-1">Last Name*</label>
                        <InputText size="small" v-model="editedUser.last_name" placeholder="Enter last name"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Date of Birth</label>
                        <DatePicker v-model="editedUser.date_of_birth" showIcon fluid :showOnFocus="false"
                            :timeCaption="'Time'" :dateFormat="'dd/mm/yyyy'" class="w-full" placeholder="DD/MM/YYYY"
                            :showYearDropdown="true" size="small" :showMonthDropdown="true" dropdownMode="select"
                            :highlightCurrentDay="true" />
                    </div>

                    <div>
                        <label class="block mb-1">Email*</label>
                        <InputText size="small" v-model="editedUser.email" placeholder="user@example.com" class="w-full"
                            required />
                    </div>

                    <div>
                        <label class="block mb-1">Role*</label>
                        <Dropdown size="small" v-model="editedUser.role_id" :options="roles" placeholder="Select role"
                            optionLabel="role_name" optionValue="id" class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Password</label>
                        <InputText size="small" type="password" v-model="editedUser.password"
                            placeholder="Leave blank to keep current" class="w-full" />
                    </div>

                    <div>
                        <label class="block mb-1">Status</label>
                        <Dropdown size="small" v-model="editedUser.status" :options="statusOptions" class="w-full" />
                    </div>
                </div>
            </div>

            <div class="mt-6 flex gap-3 justify-end">
                <Button size="small" class="w-24" label="Cancel" severity="secondary" icon="pi pi-times"
                    @click="emit('update:visible', false)" />
                <Button size="small" label="Save" icon="pi pi-check" type="submit" class="p-button-primary w-24" />
            </div>
        </form>
    </Dialog>
</template>