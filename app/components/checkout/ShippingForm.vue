<script setup lang="ts">
import type { ShippingAddress, ShippingMethod, ShippingOption } from '~/types/order'
import { SHIPPING_OPTIONS } from '~/types/order'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useAuthState } from '~/composables/useAuthState'

const props = defineProps<{
  modelValue: ShippingAddress
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ShippingAddress]
  submit: []
}>()

const { user } = useAuthState()

const shippingOptions: ShippingOption[] = SHIPPING_OPTIONS

const formData = reactive<ShippingAddress & { shippingMethod: ShippingMethod }>({
  fullName: props.modelValue.fullName || user.value?.name || '',
  documentType: props.modelValue.documentType || 'dni',
  documentNumber: props.modelValue.documentNumber || '',
  address: props.modelValue.address || '',
  phone: props.modelValue.phone || '',
  region: props.modelValue.region || '',
  shippingMethod: 'standard'
})

const errors = reactive({
  fullName: '',
  documentNumber: '',
  address: '',
  phone: '',
  region: ''
})

const regions = [
  'Amazonas', 'Ancash', 'Apurimac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huanuco',
  'Ica', 'Junin', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martin', 'Tacna', 'Tumbes', 'Ucayali'
]

// Emit shipping method change separately
watch(() => formData.shippingMethod, (method) => {
  // Could emit to parent if needed
})

function validate(): boolean {
  let isValid = true

  errors.fullName = ''
  errors.documentNumber = ''
  errors.address = ''
  errors.phone = ''
  errors.region = ''

  // For pickup, don't require address fields
  if (formData.shippingMethod === 'pickup') {
    // Skip address validation for pickup
  } else if (!formData.fullName.trim()) {
    errors.fullName = 'El nombre es requerido'
    isValid = false
  }

  if (!formData.documentNumber.trim()) {
    errors.documentNumber = 'El numero de documento es requerido'
    isValid = false
  } else if (formData.documentType === 'dni' && !/^\d{8}$/.test(formData.documentNumber)) {
    errors.documentNumber = 'DNI debe tener 8 digitos'
    isValid = false
  } else if (formData.documentType === 'ruc' && !/^\d{11}$/.test(formData.documentNumber)) {
    errors.documentNumber = 'RUC debe tener 11 digitos'
    isValid = false
  }

  if (!formData.address.trim() && formData.shippingMethod !== 'pickup') {
    errors.address = 'La direccion es requerida'
    isValid = false
  }

  if (!formData.phone.trim()) {
    errors.phone = 'El telefono es requerido'
    isValid = false
  } else if (!/^(\+51|51)?[9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Ingrese un numero de telefono valido (9 digitos)'
    isValid = false
  }

  if (!formData.region.trim() && formData.shippingMethod !== 'pickup') {
    errors.region = 'La region es requerida'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validate()) return
  // Emit the shipping method via a custom event
  emit('update:modelValue', { ...formData })
  emit('submit')
}

defineExpose({ validate })
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <!-- Shipping Method Selection -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-semibold">Metodo de envio</label>
      <div class="flex flex-col gap-2">
        <label
          v-for="option in shippingOptions"
          :key="option.id"
          class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors"
          :class="formData.shippingMethod === option.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'"
        >
          <div class="flex items-center gap-3">
            <input
              type="radio"
              :value="option.id"
              v-model="formData.shippingMethod"
              class="w-4 h-4 text-primary"
            >
            <div>
              <p class="text-sm font-medium">{{ option.name }}</p>
              <p class="text-xs text-muted-foreground">{{ option.description }}</p>
            </div>
          </div>
          <span class="text-sm font-semibold" :class="option.cost === 0 ? 'text-green-600' : ''">
            {{ option.cost === 0 ? 'Gratis' : `S/ ${option.cost.toFixed(2)}` }}
          </span>
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="fullName" class="text-sm font-semibold">Nombre completo</label>
      <Input
        id="fullName"
        v-model="formData.fullName"
        type="text"
        placeholder="Juan Perez"
        :class="cn(errors.fullName && 'border-red-600')"
      />
      <span v-if="errors.fullName" class="text-xs text-red-600">{{ errors.fullName }}</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="documentType" class="text-sm font-semibold">Tipo de documento</label>
        <select
          id="documentType"
          v-model="formData.documentType"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="dni">DNI</option>
          <option value="ruc">RUC</option>
        </select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="documentNumber" class="text-sm font-semibold">Numero de documento</label>
        <Input
          id="documentNumber"
          v-model="formData.documentNumber"
          type="text"
          :placeholder="formData.documentType === 'dni' ? '12345678' : '12345678901'"
          maxlength="11"
          :class="cn(errors.documentNumber && 'border-red-600')"
        />
        <span v-if="errors.documentNumber" class="text-xs text-red-600">{{ errors.documentNumber }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="address" class="text-sm font-semibold">Direccion</label>
      <Input
        id="address"
        v-model="formData.address"
        type="text"
        placeholder="Av. Example 123, Lima"
        :class="cn(errors.address && 'border-red-600')"
      />
      <span v-if="errors.address" class="text-xs text-red-600">{{ errors.address }}</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="phone" class="text-sm font-semibold">Telefono</label>
        <Input
          id="phone"
          v-model="formData.phone"
          type="tel"
          placeholder="987654321"
          :class="cn(errors.phone && 'border-red-600')"
        />
        <span v-if="errors.phone" class="text-xs text-red-600">{{ errors.phone }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="region" class="text-sm font-semibold">Region</label>
        <select
          id="region"
          v-model="formData.region"
          :class="cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            errors.region && 'border-red-600'
          )"
        >
          <option value="">Selecciona una region</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
        <span v-if="errors.region" class="text-xs text-red-600">{{ errors.region }}</span>
      </div>
    </div>

    <Button type="submit" class="mt-2">
      Continuar al pago
    </Button>
  </form>
</template>
