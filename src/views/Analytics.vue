<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Analytics</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Ideas This Month</h3>
          <Lightbulb class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ ideasThisMonth }}</div>
        <p class="text-xs text-gray-500">
          +{{ Math.round(Math.random() * 20) }}% from last month
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Completion Rate</h3>
          <CheckSquare class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">
          {{ completionRate }}%
        </div>
        <p class="text-xs text-gray-500">
          {{ store.completedTasks.length }} of {{ store.tasks.length }} tasks completed
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Revenue Goal Progress</h3>
          <DollarSign class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">
          {{ revenueProgress }}%
        </div>
        <p class="text-xs text-gray-500">
          ${{ store.totalRevenue }} of ${{ store.totalRevenueGoal }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-700">Indie Projects</h3>
          <Target class="h-4 w-4 text-gray-400" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ store.indieProjects.length }}</div>
        <p class="text-xs text-gray-500">
          Average progress: {{ averageProgress }}%
        </p>
      </div>
    </div>

    <!-- Charts Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-5">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Ideas Over Time</h3>
        <p class="text-sm text-gray-500 mb-4">Track your idea generation trends</p>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-600">Chart visualization would go here</p>
            <p class="text-sm text-gray-500">Ideas generated: {{ store.ideas.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-5">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Project Status Distribution</h3>
        <p class="text-sm text-gray-500 mb-4">Overview of your project pipeline</p>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <TrendingUp class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-600">Pie chart would go here</p>
            <p class="text-sm text-gray-500">Total projects: {{ store.projects.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Progress Overview -->
    <div class="bg-white rounded-lg shadow p-5">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Progress Overview</h3>
      <div class="space-y-4">
        <div 
          v-for="project in store.indieProjects" 
          :key="project.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-800">{{ project.title }}</h4>
              <span class="text-sm text-gray-600">{{ store.getProjectProgress(project.id) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                :style="{ width: `${store.getProjectProgress(project.id)}%` }"
              ></div>
            </div>
          </div>
          <div class="ml-4">
            <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusColor(project.status)"
            >
              {{ project.status }}
            </span>
          </div>
        </div>
        
        <div v-if="store.indieProjects.length === 0" class="text-center py-8">
          <p class="text-gray-500">No indie projects to track yet.</p>
        </div>
      </div>
    </div>

    <!-- Task Statistics -->
    <div class="bg-white rounded-lg shadow p-5">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ store.tasks.length }}</div>
          <div class="text-sm text-blue-800">Total Tasks</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ store.completedTasks.length }}</div>
          <div class="text-sm text-green-800">Completed</div>
        </div>
        <div class="text-center p-4 bg-red-50 rounded-lg">
          <div class="text-2xl font-bold text-red-600">{{ store.overdueTasks.length }}</div>
          <div class="text-sm text-red-800">Overdue</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Lightbulb, CheckSquare, DollarSign, Target, BarChart3, TrendingUp } from 'lucide-vue-next'
import { useCodequestsStore } from '../stores/codequests'

const store = useCodequestsStore()

const ideasThisMonth = computed(() => {
  const now = new Date()
  return store.ideas.filter(idea => {
    const ideaDate = new Date(idea.createdAt)
    return ideaDate.getMonth() === now.getMonth() && ideaDate.getFullYear() === now.getFullYear()
  }).length
})

const completionRate = computed(() => {
  if (store.tasks.length === 0) return 0
  return Math.round((store.completedTasks.length / store.tasks.length) * 100)
})

const revenueProgress = computed(() => {
  if (store.totalRevenueGoal === 0) return 0
  return Math.round((store.totalRevenue / store.totalRevenueGoal) * 100)
})

const averageProgress = computed(() => {
  if (store.indieProjects.length === 0) return 0
  const totalProgress = store.indieProjects.reduce((sum, project) => {
    return sum + store.getProjectProgress(project.id)
  }, 0)
  return Math.round(totalProgress / store.indieProjects.length)
})

function getStatusColor(status) {
  switch (status) {
    case 'brainstorming': return 'bg-blue-100 text-blue-800'
    case 'validating': return 'bg-purple-100 text-purple-800'
    case 'developing': return 'bg-orange-100 text-orange-800'
    case 'launched': return 'bg-green-100 text-green-800'
    case 'archived': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

