<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const { hydrate } = useUserSettings()

if (import.meta.client) {
  hydrate()
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster richColors position="top-right" />
</template>
