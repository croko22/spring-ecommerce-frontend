<script setup lang="ts">
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X
} from 'lucide-vue-next'

const auth = useAuthState()
const route = useRoute()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Productos' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Ordenes' },
  { to: '/admin/users', icon: Users, label: 'Usuarios' }
]

const breadcrumbs = computed(() => {
  const path = route.path
  if (path === '/admin') return [{ label: 'Dashboard' }]
  const segment = path.split('/').pop() ?? ''
  return [
    { label: 'Admin', to: '/admin' },
    { label: segment.charAt(0).toUpperCase() + segment.slice(1) }
  ]
})

function closeSidebar() {
  sidebarOpen.value = false
}

function onLogout() {
  auth.logout()
}
</script>

<template>
  <div class="admin-shell">
    <aside
      :class="['admin-sidebar', { 'admin-sidebar--open': sidebarOpen }]"
    >
      <div class="admin-sidebar__brand">
        <NuxtLink to="/admin" class="admin-sidebar__logo" @click="closeSidebar">
          Admin Panel
        </NuxtLink>
      </div>

      <nav class="admin-sidebar__nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': route.path === item.to }"
          @click="closeSidebar"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="admin-sidebar__footer">
        <div class="admin-sidebar__user">
          <span class="admin-sidebar__user-name">{{ auth.user.value?.name ?? 'Admin' }}</span>
          <span class="admin-sidebar__user-role">Administrador</span>
        </div>
        <button class="admin-sidebar__logout" @click="onLogout">
          <LogOut class="w-4 h-4" />
          Salir
        </button>
        <NuxtLink to="/" class="admin-sidebar__back">
          Volver a la tienda
        </NuxtLink>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <button class="admin-header__toggle" @click="sidebarOpen = true">
          <Menu class="w-5 h-5" />
        </button>

        <nav class="admin-breadcrumb">
          <NuxtLink
            v-for="(crumb, idx) in breadcrumbs"
            :key="idx"
            :to="crumb.to ?? ''"
            :class="['admin-breadcrumb__item', { 'admin-breadcrumb__item--current': !crumb.to }]"
          >
            {{ crumb.label }}
          </NuxtLink>
        </nav>
      </header>

      <main class="admin-content">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <div
        v-if="sidebarOpen"
        class="admin-overlay"
        @click="closeSidebar"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg-page);
}

.admin-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 40;
  transition: transform 0.25s ease;
}

.admin-sidebar__brand {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-soft);
}

.admin-sidebar__logo {
  font-weight: 700;
  font-size: 1.125rem;
  text-decoration: none;
  color: var(--text-main);
}

.admin-sidebar__nav {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.15s ease;
}

.admin-sidebar__link:hover {
  background: hsl(var(--muted));
  color: var(--text-main);
}

.admin-sidebar__link--active {
  background: hsl(var(--primary) / 0.12);
  color: hsl(var(--primary));
  font-weight: 600;
}

.admin-sidebar__footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-sidebar__user {
  display: flex;
  flex-direction: column;
}

.admin-sidebar__user-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.admin-sidebar__user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.admin-sidebar__logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid var(--border-soft);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.admin-sidebar__logout:hover {
  color: hsl(var(--destructive));
  border-color: hsl(var(--destructive));
}

.admin-sidebar__back {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
}

.admin-sidebar__back:hover {
  color: hsl(var(--primary));
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid var(--border-soft);
  position: sticky;
  top: 0;
  z-index: 30;
}

.admin-header__toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  padding: 0.25rem;
}

.admin-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.admin-breadcrumb__item {
  color: var(--text-muted);
  text-decoration: none;
}

.admin-breadcrumb__item + .admin-breadcrumb__item::before {
  content: '/';
  margin-right: 0.5rem;
  color: var(--border-soft);
}

.admin-breadcrumb__item--current {
  color: var(--text-main);
  font-weight: 600;
}

.admin-content {
  padding: 1.5rem;
}

.admin-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 35;
}

@media (max-width: 768px) {
  .admin-header__toggle {
    display: block;
  }

  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar--open {
    transform: translateX(0);
  }

  .admin-overlay {
    display: block;
  }

  .admin-main {
    margin-left: 0;
  }
}
</style>
