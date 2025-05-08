<template>
  
  <div class="max-w-4xl mx-auto">
    <h3 class="text-3xl font-semibold text-gray-800 text-center mb-8">
      Choisir votre mode de facturation
    </h3>

    <div class="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Clinique-Entreprise -->
      <div
        class="p-6 border rounded-xl cursor-pointer transition-all shadow-md hover:shadow-xl hover:bg-gray-100"
        :class="{ 'border-black scale-105 shadow-2xl': activeMode === 'entreprise' }"
        @click="selectMode('entreprise')"
      >
        <Card class="text-center p-8">
          <template #content>
            <i class="pi pi-building text-7xl text-blue-500"></i>
            <h5 class="font-bold text-gray-900 mt-4 text-2xl text-center">Clinique-Entreprise</h5>
          </template>
        </Card>
      </div>

      <!-- Clinique-Particulier -->
      <div
        class="p-6 border rounded-xl cursor-pointer transition-all shadow-md hover:shadow-xl hover:bg-gray-100"
        :class="{ 'border-black scale-105 shadow-2xl': activeMode === 'particulier' }"
        @click="selectMode('particulier')"
      >
        <Card class="text-center p-8">
          <template #content>
            <i class="pi pi-user text-7xl text-green-500"></i>
            <h5 class="font-bold text-gray-900 mt-4 text-2xl text-center">Clinique-Particulier</h5>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'

const activeMode = ref('')
const router = useRouter()

function selectMode(mode) {
  activeMode.value = mode

  setTimeout(() => {
    activeMode.value = ''
  }, 200)

  if (mode === 'entreprise') {
    router.push('/home')
  } else if (mode === 'particulier') {
    console.log("Redirection à définir pour 'Clinique-Particulier'")
  }
}
</script>

<style scoped>
.p-6 {
  transition: all 0.3s ease-in-out;
}
.p-6:hover {
  transform: translateY(-5px);
}

.border-black {
  border-color: black !important;
}
.scale-105 {
  transform: scale(1.05);
}
</style>
