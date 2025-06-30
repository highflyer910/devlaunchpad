<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <h2 class="text-2xl font-bold mb-2">Welcome back, Demo User!</h2>
      <p class="text-blue-100">
        Track your journey from idea to income. You have {{ store.ideas.length }} ideas, 
        {{ store.indieProjects.length }} indie projects, and {{ store.pendingTasks.length }} pending tasks.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Total Ideas</h3>
          <Lightbulb class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ store.ideas.length }}</div>
        <p class="text-xs text-gray-500">
          {{ brainstormingIdeas }} brainstorming
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Indie Projects</h3>
          <Target class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ store.indieProjects.length }}</div>
        <p class="text-xs text-gray-500">
          {{ store.projects.length }} total projects
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Pending Tasks</h3>
          <CheckSquare class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ store.pendingTasks.length }}</div>
        <p class="text-xs text-gray-500">
          {{ store.overdueTasks.length }} overdue
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Revenue Progress</h3>
          <DollarSign class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">${{ store.totalRevenue }}</div>
        <p class="text-xs text-gray-500">
          of ${{ store.totalRevenueGoal }} goal
        </p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-5">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Recent Ideas</h3>
        <p class="text-sm text-gray-500 mb-4">Your latest brainstorms</p>
        <div class="space-y-3">
          <div 
            v-for="idea in recentIdeas" 
            :key="idea.id" 
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-800">{{ idea.title }}</p>
              <p class="text-sm text-gray-600">{{ idea.description }}</p>
            </div>
            <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getPotentialColor(idea.potential)"
            >
              {{ idea.potential }}
            </span>
          </div>
          <div v-if="store.ideas.length === 0" class="text-gray-500 text-center py-4">
            No ideas yet. Start brainstorming!
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Active Indie Projects</h3>
        <p class="text-sm text-gray-500 mb-4">Projects in development</p>
        <div class="space-y-3">
          <div 
            v-for="project in activeIndieProjects" 
            :key="project.id" 
            class="p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="font-medium text-gray-800">{{ project.title }}</p>
              <span class="text-sm text-gray-600">{{ store.getProjectProgress(project.id) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full" 
                :style="{ width: `${store.getProjectProgress(project.id)}%` }"
              ></div>
            </div>
          </div>
          <div v-if="activeIndieProjects.length === 0" class="text-gray-500 text-center py-4">
            No active indie projects. Start building!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Lightbulb, Target, CheckSquare, DollarSign } from 'lucide-vue-next'
import { useCodequestsStore } from '../stores/codequests'

const store = useCodequestsStore()

const recentIdeas = computed(() => store.ideas.slice(-3))

const activeIndieProjects = computed(() => 
  store.indieProjects.filter(p => p.status === 'active' || p.status === 'developing').slice(0, 3)
)

const brainstormingIdeas = computed(() => 
  store.ideas.filter(idea => idea.status === 'brainstorming').length
)

function getPotentialColor(potential) {
  switch (potential) {
    case 'high': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

