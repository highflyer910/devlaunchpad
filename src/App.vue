<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <Rocket class="h-8 w-8 text-blue-600" />
          <h1 class="text-2xl font-bold text-gray-900">MakerForge</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Settings class="h-4 w-4 mr-2" />
            Settings
          </button>
          <div class="flex items-center space-x-2">
            <User class="h-6 w-6 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">User</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 px-6">
      <div class="flex space-x-1">
        <router-link
          v-for="route in navigationRoutes"
          :key="route.name"
          :to="{ name: route.name }"
          class="py-3 px-4 text-sm font-medium rounded-t-lg focus:outline-none transition-colors"
          :class="$route.name === route.name 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'"
        >
          <component :is="route.icon" class="h-4 w-4 inline-block mr-2" />
          {{ route.label }}
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Rocket, Settings, User, BarChart3, Lightbulb, Target, CheckSquare, TrendingUp } from 'lucide-vue-next'
import { useCodequestsStore } from './stores/codequests'

const store = useCodequestsStore()

const navigationRoutes = [
  { name: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { name: 'ideas', label: 'Ideas', icon: Lightbulb },
  { name: 'projects', label: 'Projects', icon: Target },
  { name: 'tasks', label: 'Tasks', icon: CheckSquare },
  { name: 'analytics', label: 'Analytics', icon: TrendingUp }
]

onMounted(() => {
  // Initialize sample data for development
  store.initializeSampleData()
})
</script>

