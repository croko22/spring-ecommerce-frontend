<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { Component } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon: Component
  trend?: { value: string; positive: boolean }
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('rounded-xl border bg-card p-5 shadow-sm', props.class)">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-muted-foreground truncate">{{ title }}</p>
        <p class="mt-1 text-2xl font-bold tracking-tight">{{ value }}</p>
        <p v-if="subtitle" class="mt-1 text-xs text-muted-foreground">{{ subtitle }}</p>
        <p v-if="trend" :class="['mt-1 text-xs font-medium', trend.positive ? 'text-success' : 'text-destructive']">
          {{ trend.value }}
        </p>
      </div>
      <div class="shrink-0 rounded-lg bg-primary/10 p-2.5">
        <component :is="icon" class="h-5 w-5 text-primary" />
      </div>
    </div>
  </div>
</template>
