<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  save: [product: Product]
  cancel: []
}>()

const form = reactive({
  name: props.product?.name ?? '',
  description: props.product?.description ?? '',
  price: props.product?.price ?? 0,
  category: props.product?.category ?? '',
  stock: props.product?.stock ?? 0,
  imageUrl: props.product?.imageUrl ?? '',
  currency: props.product?.currency ?? 'USD'
})

const errors = reactive({
  name: '',
  price: '',
  category: ''
})

function validate(): boolean {
  let valid = true
  errors.name = ''
  errors.price = ''
  errors.category = ''

  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido'
    valid = false
  }
  if (!form.price || form.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0'
    valid = false
  }
  if (!form.category.trim()) {
    errors.category = 'La categoria es requerida'
    valid = false
  }

  return valid
}

function onSubmit() {
  if (!validate()) return

  const product: Product = {
    id: props.product?.id ?? '',
    name: form.name.trim(),
    description: form.description.trim(),
    price: form.price,
    category: form.category.trim(),
    stock: form.stock,
    imageUrl: form.imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    currency: form.currency,
    inStock: form.stock > 0,
    rating: props.product?.rating ?? null
  }

  emit('save', product)
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm font-medium mb-1">Nombre</label>
      <input v-model="form.name" type="text" class="input" placeholder="Nombre del producto">
      <p v-if="errors.name" class="mt-1 text-xs text-destructive">{{ errors.name }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Descripcion</label>
      <textarea
        v-model="form.description"
        class="input min-h-[80px] resize-y"
        placeholder="Descripcion del producto"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Precio</label>
        <input v-model.number="form.price" type="number" step="0.01" min="0" class="input" placeholder="0.00">
        <p v-if="errors.price" class="mt-1 text-xs text-destructive">{{ errors.price }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Categoria</label>
        <input v-model="form.category" type="text" class="input" placeholder="Ej: Electronics">
        <p v-if="errors.category" class="mt-1 text-xs text-destructive">{{ errors.category }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Stock</label>
        <input v-model.number="form.stock" type="number" min="0" class="input" placeholder="0">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Moneda</label>
        <select v-model="form.currency" class="input">
          <option value="USD">USD</option>
          <option value="PEN">PEN</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">URL de imagen</label>
      <input v-model="form.imageUrl" type="url" class="input" placeholder="https://...">
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <button type="button" class="btn btn-outline" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn-primary">
        {{ product ? 'Guardar Cambios' : 'Crear Producto' }}
      </button>
    </div>
  </form>
</template>
