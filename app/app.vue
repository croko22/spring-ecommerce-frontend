<script setup lang="ts">
const { hydrate } = useUserSettings()

if (import.meta.client) {
  hydrate()
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
