<script setup lang="ts">
import type { ShippingAddress } from '~/types/order'
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

const formData = reactive<ShippingAddress>({
  fullName: props.modelValue.fullName || user.value?.name || '',
  documentType: props.modelValue.documentType || 'dni',
  documentNumber: props.modelValue.documentNumber || '',
  address: props.modelValue.address || '',
  phone: props.modelValue.phone || '',
  region: props.modelValue.region || ''
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

watch(formData, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })

function validate(): boolean {
  let isValid = true

  errors.fullName = ''
  errors.documentNumber = ''
  errors.address = ''
  errors.phone = ''
  errors.region = ''

  if (!formData.fullName.trim()) {
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

  if (!formData.address.trim()) {
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

  if (!formData.region.trim()) {
    errors.region = 'La region es requerida'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validate()) return
  emit('update:modelValue', { ...formData })
  emit('submit')
}

defineExpose({ validate })
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
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
