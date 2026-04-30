<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'

const route = useRoute()
const orderId = computed(() => route.query.orderId as string)

// Try to get order from checkout state
const { lastOrder } = useCheckout()

const order = computed(() => {
  if (lastOrder.value && lastOrder.value.orderId === orderId.value) {
    return lastOrder.value
  }
  return null
})

const hasError = computed(() => !order.value && orderId.value)

useSeoMeta({
  title: 'Pedido confirmado',
  description: 'Tu pedido ha sido procesado exitosamente'
})
</script>

<template>
  <section class="flex min-h-[60vh] items-center justify-center px-4 py-8">
    <Card class="w-full max-w-md text-center">
      <!-- Success state -->
      <template v-if="order">
        <CardHeader class="items-center">
          <div class="mb-4 text-5xl">✅</div>
          <h1 class="m-0 text-2xl font-semibold">Pedido confirmado</h1>
          <p class="mt-2 mb-0 text-muted-foreground">Gracias por tu compra</p>
        </CardHeader>

        <CardContent>
          <div class="mb-6 rounded-[0.65rem] bg-muted p-4 text-left">
            <div class="flex justify-between border-b border-border py-1.5 last:border-b-0">
              <span class="text-sm text-muted-foreground">Numero de pedido:</span>
              <span class="font-semibold">{{ order.orderId }}</span>
            </div>
            <div class="flex justify-between border-b border-border py-1.5 last:border-b-0">
              <span class="text-sm text-muted-foreground">Estado:</span>
              <span class="font-semibold text-green-800">
                {{ order.status === 'confirmed' ? 'Confirmado' : 'Pendiente' }}
              </span>
            </div>
            <div class="flex justify-between border-b border-border py-1.5 last:border-b-0">
              <span class="text-sm text-muted-foreground">Total:</span>
              <span class="text-lg font-semibold text-orange-900">
                {{ formatPenAmount(order.total) }}
              </span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-sm text-muted-foreground">Items:</span>
              <span class="font-semibold">{{ order.items.length }} productos</span>
            </div>
          </div>

          <p class="mb-6 text-sm text-muted-foreground">
            Recibiras un correo de confirmacion cuando tu pedido sea procesado.
          </p>
        </CardContent>
      </template>

      <!-- Error state -->
      <template v-else-if="hasError">
        <CardHeader class="items-center">
          <div class="mb-4 text-5xl grayscale">❌</div>
          <h1 class="m-0 text-2xl font-semibold">Algo salio mal</h1>
          <p class="mt-2 mb-0 text-muted-foreground">No pudimos encontrar tu pedido</p>
        </CardHeader>

        <CardContent>
          <p class="mb-6 text-sm text-muted-foreground">
            Por favor verifica el numero de pedido o contacta con soporte.
          </p>
        </CardContent>
      </template>

      <!-- No order state -->
      <template v-else>
        <CardHeader class="items-center">
          <div class="mb-4 text-5xl grayscale">❌</div>
          <h1 class="m-0 text-2xl font-semibold">Sin pedido</h1>
        </CardHeader>

        <CardContent>
          <p class="mb-6 text-sm text-muted-foreground">
            No tienes ningun pedido reciente.
          </p>
        </CardContent>
      </template>

      <CardFooter class="justify-center">
        <Button as="a" href="/products" size="lg" class="font-bold">
          Continuar comprando
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>
