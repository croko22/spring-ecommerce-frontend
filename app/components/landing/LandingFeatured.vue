<script setup lang="ts">
import type { Product } from '~/types/product'
import { listProducts } from '~/services/productService'

const featured = ref<Product[]>([])

onMounted(async () => {
  const result = await listProducts({ page: 1, size: 6, sort: 'rating' })
  featured.value = result.items
})
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="container px-4">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            Productos Destacados
          </h2>
          <p class="mt-2 text-muted-foreground">
            Los productos mejor valorados por nuestra comunidad.
          </p>
        </div>
        <NuxtLink
          to="/products"
          class="hidden whitespace-nowrap text-sm font-semibold text-primary underline-offset-4 hover:underline sm:block"
        >
          Ver todos los productos &rarr;
        </NuxtLink>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <ProductCard
          v-for="product in featured"
          :key="product.id"
          :product="product"
        />
      </div>

      <div class="mt-10 text-center sm:hidden">
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          Ver todos los productos
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
