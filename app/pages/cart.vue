<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'

const {
  items,
  subtotal,
  totalItems,
  isEmpty,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart
} = useCart()

const shippingCost = computed(() => 0)
const taxes = computed(() => 0)
const orderTotal = computed(() => subtotal.value + shippingCost.value + taxes.value)

function formatAmount(amount: number) {
  return formatPenAmount(amount)
}

function itemSubtotal(price: number, quantity: number) {
  return formatAmount(price * quantity)
}

useSeoMeta({
  title: 'Carrito de compras',
  description: 'Gestiona tus productos y revisa el resumen de compra.'
})
</script>

<template>
  <section class="cart-page">
    <header class="cart-page__header">
      <div>
        <p class="cart-page__eyebrow">Checkout</p>
        <h1>Carrito de compras</h1>
        <p class="cart-page__subtitle">Revisa cantidades, elimina productos y confirma tu resumen.</p>
      </div>
      <button
        type="button"
        class="cart-page__clear"
        :disabled="isEmpty"
        @click="clearCart"
      >
        Vaciar carrito
      </button>
    </header>

    <div v-if="isEmpty" class="cart-empty">
      <p class="cart-empty__title">Tu carrito esta vacio.</p>
      <p class="cart-empty__text">Agrega productos desde el catalogo para iniciar tu compra.</p>
      <NuxtLink class="cart-empty__cta" to="/products">Ir al catalogo</NuxtLink>
    </div>

    <div v-else class="cart-layout">
      <ul class="cart-items" aria-label="Productos en carrito">
        <li v-for="item in items" :key="item.productId" class="cart-item">
          <NuxtLink class="cart-item__media" :to="`/products/${encodeURIComponent(item.productId)}`">
            <img :src="item.imageUrl" :alt="item.name" loading="lazy" decoding="async">
          </NuxtLink>

          <div class="cart-item__body">
            <NuxtLink class="cart-item__name" :to="`/products/${encodeURIComponent(item.productId)}`">
              {{ item.name }}
            </NuxtLink>
            <p class="cart-item__price">{{ formatAmount(item.price) }} c/u</p>

            <div class="cart-item__actions">
              <div class="cart-item__qty" aria-label="Control de cantidad">
                <button type="button" @click="decrementItem(item.productId)">-</button>
                <span>{{ item.quantity }}</span>
                <button type="button" @click="incrementItem(item.productId)">+</button>
              </div>

              <button type="button" class="cart-item__remove" @click="removeItem(item.productId)">
                Eliminar
              </button>
            </div>
          </div>

          <p class="cart-item__subtotal">{{ itemSubtotal(item.price, item.quantity) }}</p>
        </li>
      </ul>

      <aside class="cart-summary">
        <h2>Resumen</h2>
        <dl>
          <div>
            <dt>Items</dt>
            <dd>{{ totalItems }}</dd>
          </div>
          <div>
            <dt>Subtotal</dt>
            <dd>{{ formatAmount(subtotal) }}</dd>
          </div>
          <div>
            <dt>Envio</dt>
            <dd>{{ formatAmount(shippingCost) }}</dd>
          </div>
          <div>
            <dt>Impuestos</dt>
            <dd>{{ formatAmount(taxes) }}</dd>
          </div>
          <div class="cart-summary__total">
            <dt>Total</dt>
            <dd>{{ formatAmount(orderTotal) }}</dd>
          </div>
        </dl>

        <NuxtLink
          type="button"
          class="cart-summary__checkout"
          :class="{ 'cart-summary__checkout--disabled': isEmpty }"
          :to="isEmpty ? undefined : '/checkout'"
        >
          {{ isEmpty ? 'Agrega productos al carrito' : 'Continuar compra' }}
        </NuxtLink>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.cart-page {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.cart-page__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cart-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

h1 {
  margin: 0.25rem 0 0;
  font-size: clamp(1.45rem, 3.5vw, 2rem);
}

.cart-page__subtitle {
  margin: 0.45rem 0 0;
  color: var(--text-muted);
}

.cart-page__clear {
  border: 1px solid var(--border-soft);
  background: #fff;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
}

.cart-page__clear:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cart-empty {
  margin-top: 1rem;
  border: 1px solid var(--border-soft);
  background: #fff;
  border-radius: 0.85rem;
  padding: 1rem;
}

.cart-empty__title {
  margin: 0;
  font-weight: 700;
}

.cart-empty__text {
  margin: 0.45rem 0 0;
  color: var(--text-muted);
}

.cart-empty__cta {
  display: inline-block;
  margin-top: 0.85rem;
  padding: 0.6rem 0.95rem;
  border-radius: 0.65rem;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(125deg, var(--accent), var(--accent-strong));
  font-weight: 700;
}

.cart-layout {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(16rem, 1fr);
  gap: 1rem;
  align-items: start;
}

.cart-items {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
}

.cart-item {
  border: 1px solid var(--border-soft);
  border-radius: 0.85rem;
  background: #fff;
  padding: 0.8rem;
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
}

.cart-item__media {
  display: block;
  border-radius: 0.65rem;
  overflow: hidden;
  background: #eef2f7;
  aspect-ratio: 1 / 1;
}

.cart-item__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cart-item__name {
  text-decoration: none;
  font-weight: 700;
}

.cart-item__price {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.cart-item__actions {
  margin-top: 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.cart-item__qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  overflow: hidden;
}

.cart-item__qty button {
  border: 0;
  background: #f8fafc;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.cart-item__qty span {
  min-width: 1.9rem;
  text-align: center;
  font-weight: 700;
}

.cart-item__remove {
  border: 0;
  background: transparent;
  color: #991b1b;
  text-decoration: underline;
  cursor: pointer;
}

.cart-item__subtotal {
  margin: 0;
  font-weight: 800;
  color: #7c2d12;
}

.cart-summary {
  border: 1px solid var(--border-soft);
  border-radius: 0.85rem;
  background: #fff;
  padding: 0.95rem;
}

h2 {
  margin: 0;
  font-size: 1.08rem;
}

.cart-summary dl {
  margin: 0.85rem 0 0;
  display: grid;
  gap: 0.55rem;
}

.cart-summary dl > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.cart-summary dt {
  color: var(--text-muted);
}

.cart-summary dd {
  margin: 0;
  font-weight: 600;
}

.cart-summary__total {
  margin-top: 0.2rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--border-soft);
}

.cart-summary__total dd {
  font-size: 1.08rem;
  color: #7c2d12;
}

.cart-summary__checkout {
  width: 100%;
  margin-top: 0.9rem;
  border: 1px solid rgb(180 83 9 / 0.24);
  border-radius: 0.65rem;
  padding: 0.75rem 0.85rem;
  background: linear-gradient(125deg, var(--accent), var(--accent-strong));
  color: #fff;
  font-weight: 700;
}

.cart-summary__checkout:disabled,
.cart-summary__checkout--disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

@media (max-width: 860px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .cart-page {
    padding-inline: 0.85rem;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .cart-item__media {
    width: 6rem;
  }

  .cart-item__subtotal {
    justify-self: flex-start;
  }
}
</style>
