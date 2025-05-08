<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const props = defineProps({
    visible: Boolean,
    prestation: Object
})

const emit = defineEmits(['update:visible', 'validate'])
</script>

<template>
    <Dialog v-bind="visible" :style="{ width: '500px' }" header="Validate Medical Act" :modal="true">
        <div v-if="prestation" class="grid gap-4">
            <div class="text-center py-4">
                <i class="pi pi-check-circle text-5xl text-green-500 mb-3"></i>
                <h3 class="text-xl font-bold mb-1">{{ prestation.act_name }}</h3>
                <p class="text-gray-600">{{ prestation.specialty }}</p>
                <p class="text-lg font-medium mt-2">{{ prestation.unit_price }} DH × {{
                    prestation.quantity }} =
                    <span class="font-bold">{{ prestation.unit_price * prestation.quantity }}
                        DH</span>
                </p>
            </div>

            <div class="field">
                <label for="validationNotes" class="block text-sm font-medium mb-1">Validation Notes</label>
                <InputText id="validationNotes" v-model="prestation.notes" class="w-full" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="$emit('update:visible', false)" class="p-button-text" />
            <Button label="Confirm Validation" icon="pi pi-check" @click="$emit('validate')" class="p-button-success" />
        </template>
    </Dialog>
</template>