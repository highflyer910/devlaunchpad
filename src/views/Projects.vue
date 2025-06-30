<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Projects</h2>
      <button 
        @click="showProjectModal = true"
        class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus class="h-4 w-4 mr-2" />
        Add Project
      </button>
    </div>

    <!-- Indie Projects Kanban Board -->
    <div v-if="store.indieProjects.length > 0" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">Indie Projects Pipeline</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div 
          v-for="status in indieProjectStatuses" 
          :key="status" 
          class="bg-white rounded-lg shadow border border-gray-200 p-4"
        >
          <h4 class="font-semibold text-gray-900 mb-4 capitalize">{{ status }}</h4>
          <div class="space-y-3">
            <div 
              v-for="project in getProjectsByStatus(status)" 
              :key="project.id" 
              class="bg-gray-50 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <h5 class="font-medium text-gray-800 mb-2">{{ project.title }}</h5>
              <p class="text-sm text-gray-600 mb-3">{{ project.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">
                  Progress: {{ store.getProjectProgress(project.id) }}%
                </div>
                <select
                  :value="project.status"
                  @change="updateProjectStatus(project.id, $event.target.value)"
                  class="block w-auto text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                >
                  <option value="brainstorming">Brainstorming</option>
                  <option value="validating">Validating</option>
                  <option value="developing">Developing</option>
                  <option value="launched">Launched</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regular Projects Grid -->
    <div v-if="store.regularProjects.length > 0" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">Regular Projects</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in store.regularProjects" 
          :key="project.id" 
          class="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-semibold text-gray-900">{{ project.title }}</h4>
            <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusColor(project.status)"
            >
              {{ project.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ project.description }}</p>
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-700">Progress</span>
                <span class="font-medium text-gray-900">{{ store.getProjectProgress(project.id) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{ width: `${store.getProjectProgress(project.id)}%` }"
                ></div>
              </div>
            </div>
            
            <div class="flex space-x-2 pt-2">
              <button 
                @click="promoteToIndieProject(project.id)"
                class="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Rocket class="h-4 w-4 mr-1" />
                Make Indie
              </button>
              <button 
                @click="deleteProject(project.id)"
                class="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Indie Projects Grid -->
    <div v-if="store.indieProjects.length > 0" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">All Indie Projects</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in store.indieProjects" 
          :key="project.id" 
          class="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-semibold text-gray-900">{{ project.title }}</h4>
            <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusColor(project.status)"
            >
              {{ project.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ project.description }}</p>
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-700">Progress</span>
                <span class="font-medium text-gray-900">{{ store.getProjectProgress(project.id) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{ width: `${store.getProjectProgress(project.id)}%` }"
                ></div>
              </div>
            </div>
            
            <div v-if="project.revenueGoal" class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Revenue Goal:</span>
              <span class="font-medium text-gray-900">${{ project.revenueGoal }}</span>
            </div>
            
            <div v-if="project.launchDate" class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Launch Date:</span>
              <span class="font-medium text-gray-900">{{ formatDate(project.launchDate) }}</span>
            </div>
            
            <div class="flex space-x-2 pt-2">
              <button class="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Calendar class="h-4 w-4 mr-1" />
                Tasks
              </button>
              <button 
                @click="deleteProject(project.id)"
                class="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="store.projects.length === 0" class="bg-white rounded-lg shadow text-center p-12">
      <Target class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
      <p class="text-gray-600 mb-4">Start your first project and track your progress from idea to income.</p>
      <button 
        @click="showProjectModal = true"
        class="flex items-center mx-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus class="h-4 w-4 mr-2" />
        Create Your First Project
      </button>
    </div>

    <!-- Add Project Modal -->
    <div v-if="showProjectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div class="relative p-6 bg-white rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Project</h3>
        <p class="text-sm text-gray-500 mb-4">Start tracking a new project from development to launch.</p>
        <form @submit.prevent="addProject">
          <div class="space-y-4">
            <div>
              <label for="project-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="project-title"
                v-model="newProject.title"
                placeholder="Enter project title"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label for="project-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="project-description"
                v-model="newProject.description"
                placeholder="Describe your project"
                rows="3"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              ></textarea>
            </div>
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="newProject.isIndieProject"
                  class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">This is an indie project</span>
              </label>
            </div>
            <div v-if="newProject.isIndieProject">
              <label for="project-revenue" class="block text-sm font-medium text-gray-700 mb-1">Revenue Goal ($)</label>
              <input
                type="number"
                id="project-revenue"
                v-model="newProject.revenueGoal"
                placeholder="1000"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div v-if="newProject.isIndieProject">
              <label for="project-launch" class="block text-sm font-medium text-gray-700 mb-1">Launch Date</label>
              <input
                type="date"
                id="project-launch"
                v-model="newProject.launchDate"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showProjectModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Target, Rocket, Trash2, Calendar } from 'lucide-vue-next'
import { useCodequestsStore } from '../stores/codequests'

const store = useCodequestsStore()

const showProjectModal = ref(false)
const newProject = ref({
  title: '',
  description: '',
  isIndieProject: false,
  revenueGoal: '',
  launchDate: ''
})

const indieProjectStatuses = ['brainstorming', 'validating', 'developing', 'launched', 'archived']

function addProject() {
  if (newProject.value.title.trim()) {
    store.addProject(newProject.value)
    newProject.value = {
      title: '',
      description: '',
      isIndieProject: false,
      revenueGoal: '',
      launchDate: ''
    }
    showProjectModal.value = false
  }
}

function promoteToIndieProject(projectId) {
  store.promoteToIndieProject(projectId)
}

function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    store.deleteProject(id)
  }
}

function updateProjectStatus(projectId, newStatus) {
  store.updateProject(projectId, { status: newStatus })
}

function getProjectsByStatus(status) {
  return store.indieProjects.filter(project => project.status === status)
}

function getStatusColor(status) {
  switch (status) {
    case 'brainstorming': return 'bg-blue-100 text-blue-800'
    case 'validating': return 'bg-purple-100 text-purple-800'
    case 'developing': return 'bg-orange-100 text-orange-800'
    case 'launched': return 'bg-green-100 text-green-800'
    case 'archived': return 'bg-gray-100 text-gray-800'
    case 'active': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>

