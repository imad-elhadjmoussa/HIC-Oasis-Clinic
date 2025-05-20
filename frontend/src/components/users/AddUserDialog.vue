<script setup>
import { ref, defineEmits, defineModel, onMounted } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";
import { createUser } from "./../../api/users.js";
import { specialties } from "../../pages/Reception/index.js";
import DatePicker from "primevue/datepicker";
import { getRoles } from "./../../api/roles.js";

const props = defineProps({
    roles: {
        type: Array,
        default: () => [],
    },
    specialties: {
        type: Array,
        default: () => [],
    },
    visible: Boolean,
});

const statusOptions = ["active", "inactive"];
const genderOptions = ["Male", "Female", "Other"];



const visible = defineModel("visible");
const newUser = ref({
    first_name: "",
    last_name: "",
    national_id_number: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    gender: "",
    role_id: "", // Default role
    specialty_id: "",
    status: "active",
    password: "",
});

const toast = useToast();
const emit = defineEmits(["user-created"]);


const addUser = async () => {
    try {
        const createdUser = await createUser(newUser.value);
        emit("user-created");
        toast.add({
            severity: "success",
            summary: "Success",
            detail: createdUser.message,
            life: 3000,
        });
        // Reset form
        newUser.value = {
            first_name: "",
            last_name: "",
            national_id_number: "",
            date_of_birth: "",
            phone_number: "",
            email: "",
            gender: "",
            role_id: "",
            specialty: "",
            status: "active",
            password: "",
        };
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
    <Dialog v-model:visible="visible" class="w-full max-w-[700px]" header="Add New User" modal>
        <form class="p-fluid flex flex-col px-5 gap-3" @submit.prevent="addUser">
            <div class="grid grid-cols-2 gap-4">
                <!-- Column 1 -->
                <div class="space-y-3">
                    <div>
                        <label class="block mb-1">First Name*</label>
                        <InputText size="small" v-model="newUser.first_name" placeholder="Enter first name"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">National ID*</label>
                        <InputText size="small" v-model="newUser.national_id_number"
                            placeholder="National identification number" class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Phone Number*</label>
                        <InputText size="small" v-model="newUser.phone_number" placeholder="+123 456 7890"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Gender</label>
                        <Dropdown size="small" v-model="newUser.gender" :options="genderOptions"
                            placeholder="Select gender" class="w-full" />
                    </div>

                    <div>
                        <label class="block mb-1">Specialty</label>
                        <Dropdown size="small" v-model="newUser.specialty_id" :options="specialties" optionLabel="specialty_name" optionValue="id"
                            placeholder="Select specialty" class="w-full" :disabled="newUser.role !== 5 " />
                    </div>
                </div>

                <!-- Column 2 -->
                <div class="space-y-3">
                    <div>
                        <label class="block mb-1">Last Name*</label>
                        <InputText size="small" v-model="newUser.last_name" placeholder="Enter last name" class="w-full"
                            required />
                    </div>

                    <div>
                        <label class="block mb-1">Date of Birth</label>
                        <DatePicker v-model="newUser.date_of_birth" showIcon fluid :showOnFocus="false"
                            :timeCaption="'Time'" size="small" dateFormat="dd/mm/yy" class="w-full" placeholder="dd/mm/yyyy"
                             />
                    </div>

                    <div>
                        <label class="block mb-1">Email*</label>
                        <InputText size="small" v-model="newUser.email" placeholder="user@example.com" class="w-full"
                            required />
                    </div>

                    <div>
                        <label class="block mb-1">Role*</label>
                        <Dropdown size="small" v-model="newUser.role_id" optionLabel="role_name" optionValue="id" :options="roles" placeholder="Select role"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Password*</label>
                        <InputText size="small" type="password" v-model="newUser.password" placeholder="Create password"
                            class="w-full" required />
                    </div>

                    <div>
                        <label class="block mb-1">Status</label>
                        <Dropdown size="small" v-model="newUser.status" :options="statusOptions" class="w-full" />
                    </div>
                </div>
            </div>

            <div class="mt-6 flex gap-3 justify-end">
                <Button size="small" class="w-24" label="Cancel" severity="secondary" icon="pi pi-times"
                    @click="visible = false" />
                <Button size="small" label="Save" icon="pi pi-check" type="submit"
                    class="p-button-primary w-24" />
            </div>
        </form>
    </Dialog>
</template>