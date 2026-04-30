<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = defineProps<{
  currentStep: number
}>()

const steps = [
  { number: 1, label: 'Envio' },
  { number: 2, label: 'Pago' },
  { number: 3, label: 'Revision' }
]

defineEmits<{
  goToStep: [step: 1 | 2 | 3]
}>()
</script>

<template>
  <nav aria-label="Pasos del checkout" class="mb-4">
    <ol class="flex justify-center gap-2 list-none m-0 p-0">
      <li
        v-for="step in steps"
        :key="step.number"
      >
        <button
          type="button"
          :disabled="step.number > currentStep"
          :class="cn(
            'flex items-center gap-2 px-4 py-2 border rounded-full transition-all',
            step.number === currentStep
              ? 'border-primary bg-primary text-primary-foreground'
              : step.number < currentStep
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'border-border bg-background opacity-60 cursor-not-allowed'
          )"
          @click="$emit('goToStep', step.number as 1 | 2 | 3)"
        >
          <span
            :class="cn(
              'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
              step.number === currentStep
                ? 'bg-white/20'
                : step.number < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-muted'
            )"
          >
            <template v-if="step.number < currentStep">&#10003;</template>
            <template v-else>{{ step.number }}</template>
          </span>
          <span class="text-sm font-semibold sm:inline hidden">{{ step.label }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>
