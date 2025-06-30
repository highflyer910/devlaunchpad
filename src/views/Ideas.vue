<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Ideas</h2>
      <button 
        @click="showIdeaModal = true"
        class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus class="h-4 w-4 mr-2" />
        Add Idea
      </button>
    </div>

    <!-- Ideas List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="idea in store.ideas" 
        :key="idea.id" 
        class="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ idea.title }}</h3>
          <span 
            class="px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getPotentialColor(idea.potential)"
          >
            {{ idea.potential }}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-4">{{ idea.description }}</p>
        
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">
            {{ formatDate(idea.createdAt) }}
          </span>
          <div class="flex space-x-2">
            <button 
              @click="promoteToProject(idea)"
              class="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Rocket class="h-3 w-3 mr-1" />
              Promote to Indie Project
            </button>
            <button 
              @click="deleteIdea(idea.id)"
              class="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Trash2 class="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="store.ideas.length === 0" class="bg-white rounded-lg shadow text-center p-12">
      <Lightbulb class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
      <p class="text-gray-600 mb-4">Start capturing your project ideas and turn them into reality.</p>
      <button 
        @click="showIdeaModal = true"
        class="flex items-center mx-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus class="h-4 w-4 mr-2" />
        Add Your First Idea
      </button>
    </div>

    <!-- Add Idea Modal -->
    <div v-if="showIdeaModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div class="relative p-6 bg-white rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Idea</h3>
        <p class="text-sm text-gray-500 mb-4">Capture your next big idea and track its potential.</p>
        <form @submit.prevent="addIdea">
          <div class="space-y-4">
            <div>
              <label for="idea-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="idea-title"
                v-model="newIdea.title"
                placeholder="Enter idea title"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label for="idea-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="idea-description"
                v-model="newIdea.description"
                placeholder="Describe your idea"
                rows="3"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              ></textarea>
            </div>
            <div>
              <label for="idea-potential" class="block text-sm font-medium text-gray-700 mb-1">Potential</label>
              <select
                id="idea-potential"
                v-model="newIdea.potential"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showIdeaModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Idea
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Lightbulb, Rocket, Trash2 } from 'lucide-vue-next'
import { useCodequestsStore } from '../stores/codequests'

const store = useCodequestsStore()
const router = useRouter()

const showIdeaModal = ref(false)
const newIdea = ref({
  title: '',
  description: '',
  potential: 'medium'
})

function addIdea() {
  if (newIdea.value.title.trim()) {
    store.addIdea(newIdea.value)
    newIdea.value = {
      title: '',
      description: '',
      potential: 'medium'
    }
    showIdeaModal.value = false
  }
}

function promoteToProject(idea) {
  // Create a new project from the idea
  const project = {
    title: idea.title,
    description: idea.description,
    isIndieProject: true,
    status: 'brainstorming',
    revenueGoal: '',
    launchDate: ''
  }
  
  store.addProject(project)
  
  // Remove the idea since it's now a project
  store.deleteIdea(idea.id)
  
  // Navigate to projects page
  router.push({ name: 'projects' })
}

function deleteIdea(id) {
  if (confirm('Are you sure you want to delete this idea?')) {
    store.deleteIdea(id)
  }
}

function getPotentialColor(potential) {
  switch (potential) {
    case 'high': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>

