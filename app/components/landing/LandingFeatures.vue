<script setup lang="ts">
import { ShoppingBag, Truck, CreditCard, Headphones } from 'lucide-vue-next'

interface Feature {
  icon: any
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: ShoppingBag,
    title: 'Productos de calidad',
    description: 'Seleccionamos los mejores productos para ofrecerte una experiencia de compra excepcional.'
  },
  {
    icon: Truck,
    title: 'Envío rápido',
    description: 'Entregas en tiempo récord con seguimiento en tiempo real para que sepas dónde está tu pedido.'
  },
  {
    icon: CreditCard,
    title: 'Pago seguro',
    description: 'Tus transacciones están protegidas con los más altos estándares de seguridad.'
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Nuestro equipo está disponible para ayudarte en cualquier momento, todos los días.'
  }
]
</script>

<template>
  <section class="bg-background py-20 md:py-28">
    <div class="container px-4">
      <h2 class="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        ¿Por qué elegirnos?
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Todo lo que necesitas para una experiencia de compra única
      </p>

      <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <component :is="feature.icon" class="h-6 w-6" />
          </div>
          <h3 class="mt-4 font-semibold">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
