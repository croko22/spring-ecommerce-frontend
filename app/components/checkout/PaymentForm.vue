<script setup lang="ts">
import type { CreditCardPayment } from '~/types/order'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  paymentMethod: string
  creditCard: CreditCardPayment | null
}>()

const emit = defineEmits<{
  'update:paymentMethod': [value: string]
  'update:creditCard': [value: CreditCardPayment | null]
  submit: []
}>()

const localMethod = ref(props.paymentMethod || '')

const cardData = reactive<CreditCardPayment>({
  cardNumber: props.creditCard?.cardNumber || '',
  expiryDate: props.creditCard?.expiryDate || '',
  cvv: props.creditCard?.cvv || '',
  cardholderName: props.creditCard?.cardholderName || ''
})

const errors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s/g, '')
  if (!/^\d{16}$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
        let d = parseInt(digits[i] ?? '0', 10)
    if ((digits.length - i) % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2)
  }
  return digits
}

function onCardNumberInput(event: Event) {
  const input = event.target as HTMLInputElement
  const formatted = formatCardNumber(input.value)
  cardData.cardNumber = formatted
  input.value = formatted
}

function onExpiryInput(event: Event) {
  const input = event.target as HTMLInputElement
  const formatted = formatExpiry(input.value)
  cardData.expiryDate = formatted
  input.value = formatted
}

function onCvvInput(event: Event) {
  const input = event.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 3)
  cardData.cvv = digits
  input.value = digits
}

watch(localMethod, (val) => {
  emit('update:paymentMethod', val)
})

watch(cardData, (val) => {
  if (localMethod.value === 'credit_card') {
    emit('update:creditCard', { ...val })
  }
}, { deep: true })

function selectMethod(method: string) {
  localMethod.value = method
  if (method === 'credit_card') {
    emit('update:creditCard', { ...cardData })
  } else {
    emit('update:creditCard', null)
  }
}

function validateCard(): boolean {
  let isValid = true
  errors.cardNumber = ''
  errors.expiryDate = ''
  errors.cvv = ''
  errors.cardholderName = ''

  const rawNumber = cardData.cardNumber.replace(/\s/g, '')
  if (!rawNumber) {
    errors.cardNumber = 'El numero de tarjeta es requerido'
    isValid = false
  } else if (!luhnCheck(rawNumber)) {
    errors.cardNumber = 'Numero de tarjeta invalido'
    isValid = false
  }

  if (!cardData.expiryDate) {
    errors.expiryDate = 'La fecha de expiracion es requerida'
    isValid = false
  } else {
    const match = cardData.expiryDate.match(/^(\d{2})\/(\d{2})$/)
    if (!match) {
      errors.expiryDate = 'Formato invalido (MM/AA)'
      isValid = false
    } else {
        const month = parseInt(match[1] ?? '0', 10)
        const year = parseInt('20' + (match[2] ?? '0'), 10)
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      if (month < 1 || month > 12) {
        errors.expiryDate = 'Mes invalido'
        isValid = false
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = 'La tarjeta ha expirado'
        isValid = false
      }
    }
  }

  if (!cardData.cvv) {
    errors.cvv = 'El CVV es requerido'
    isValid = false
  } else if (!/^\d{3}$/.test(cardData.cvv)) {
    errors.cvv = 'CVV debe tener 3 digitos'
    isValid = false
  }

  if (!cardData.cardholderName.trim()) {
    errors.cardholderName = 'El nombre del titular es requerido'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (localMethod.value !== 'credit_card') {
    emit('submit')
    return
  }

  if (!validateCard()) return
  emit('submit')
}

function handleBack() {
  emit('update:paymentMethod', localMethod.value)
  if (localMethod.value === 'credit_card') {
    emit('update:creditCard', { ...cardData })
  }
}

defineExpose({ validateCard })
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold m-0">Metodo de pago</h2>

    <div class="flex flex-col gap-3">
      <button
        type="button"
        :class="cn(
          'flex items-center gap-4 p-4 border rounded-xl text-left transition-all',
          localMethod === 'credit_card'
            ? 'border-primary bg-amber-50'
            : 'border-border bg-background hover:border-primary'
        )"
        @click="selectMethod('credit_card')"
      >
        <span class="text-2xl">&#x1F4B3;</span>
        <div>
          <span class="block font-bold">Tarjeta de credito</span>
          <span class="block text-sm text-muted-foreground">Paga con Visa, Mastercard u otras</span>
        </div>
      </button>

      <button
        type="button"
        :class="cn(
          'flex items-center gap-4 p-4 border rounded-xl text-left transition-all',
          localMethod === 'cash_on_delivery'
            ? 'border-primary bg-amber-50'
            : 'border-border bg-background hover:border-primary'
        )"
        @click="selectMethod('cash_on_delivery')"
      >
        <span class="text-2xl">&#x1F4B5;</span>
        <div>
          <span class="block font-bold">Contra entrega</span>
          <span class="block text-sm text-muted-foreground">Paga cuando recibas tu pedido</span>
        </div>
      </button>
    </div>

    <div v-if="localMethod === 'credit_card'" class="flex flex-col gap-4 mt-2 p-4 border border-border rounded-xl bg-background">
      <div class="flex flex-col gap-1.5">
        <label for="cardNumber" class="text-sm font-semibold">Numero de tarjeta</label>
        <Input
          id="cardNumber"
          :model-value="cardData.cardNumber"
          placeholder="0000 0000 0000 0000"
          :class="cn(errors.cardNumber && 'border-red-600')"
          @input="onCardNumberInput"
        />
        <span v-if="errors.cardNumber" class="text-xs text-red-600">{{ errors.cardNumber }}</span>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="expiryDate" class="text-sm font-semibold">Expiracion (MM/AA)</label>
          <Input
            id="expiryDate"
            :model-value="cardData.expiryDate"
            placeholder="MM/AA"
            maxlength="5"
            :class="cn(errors.expiryDate && 'border-red-600')"
            @input="onExpiryInput"
          />
          <span v-if="errors.expiryDate" class="text-xs text-red-600">{{ errors.expiryDate }}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="cvv" class="text-sm font-semibold">CVV</label>
          <Input
            id="cvv"
            :model-value="cardData.cvv"
            type="password"
            placeholder="123"
            maxlength="3"
            :class="cn(errors.cvv && 'border-red-600')"
            @input="onCvvInput"
          />
          <span v-if="errors.cvv" class="text-xs text-red-600">{{ errors.cvv }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="cardholderName" class="text-sm font-semibold">Nombre del titular</label>
        <Input
          id="cardholderName"
          v-model="cardData.cardholderName"
          type="text"
          placeholder="JUAN PEREZ"
          :class="cn(errors.cardholderName && 'border-red-600')"
        />
        <span v-if="errors.cardholderName" class="text-xs text-red-600">{{ errors.cardholderName }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2 mt-2">
      <Button type="button" @click="handleSubmit">
        Continuar a revision
      </Button>
      <Button type="button" variant="outline" @click="handleBack">
        Volver a envio
      </Button>
    </div>
  </div>
</template>
