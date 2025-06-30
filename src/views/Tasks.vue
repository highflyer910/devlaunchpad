<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Tasks</h2>
      <button 
        @click="showTaskModal = true"
        class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus class="h-4 w-4 mr-2" />
        Add Task
      </button>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-lg shadow p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">All Tasks</h3>
        <div class="flex items-center space-x-2">
          <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Filter class="h-4 w-4 mr-2" />
            Filter
          </button>
          <button class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Search class="h-4 w-4 mr-2" />
            Search
          </button>
        </div>
      </div>
      <div class="space-y-3">
        <div 
          v-for="task in store.tasks" 
          :key="task.id" 
          class="flex items-center space-x-4 p-4 rounded-lg border transition-colors"
          :class="[
            task.completed ? 'bg-gray-50' : 'bg-white',
            isOverdue(task) ? 'border-red-200' : 'border-gray-200'
          ]"
        >
          <input
            type="checkbox"
            :checked="task.completed"
            @change="store.toggleTask(task.id)"
            class="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <h4 
                class="font-medium text-gray-800"
                :class="{ 'line-through text-gray-500': task.completed }"
              >
                {{ task.title }}
              </h4>
              <div 
                class="w-2 h-2 rounded-full"
                :class="getPriorityColor(task.priority)"
              ></div>
            </div>
            <p class="text-sm text-gray-600">{{ task.description }}</p>
            <div v-if="getProjectForTask(task)" class="text-xs text-blue-600 mt-1">
              {{ getProjectForTask(task).title }}
            </div>
          </div>
          <div class="text-right">
            <div v-if="task.dueDate" 
              class="text-sm"
              :class="isOverdue(task) ? 'text-red-600 font-medium' : 'text-gray-600'"
            >
              {{ formatDate(task.dueDate) }}
            </div>
            <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              :class="getPriorityColor(task.priority)"
            >
              {{ task.priority }}
            </span>
          </div>
        </div>
        
        <div v-if="store.tasks.length === 0" class="text-center py-12">
          <CheckSquare class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p class="text-gray-600">Add your first task to start tracking your progress.</p>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div class="relative p-6 bg-white rounded-lg shadow-xl max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Task</h3>
        <p class="text-sm text-gray-500 mb-4">Create a task and assign it to a project.</p>
        <form @submit.prevent="addTask">
          <div class="space-y-4">
            <div>
              <label for="task-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="task-title"
                v-model="newTask.title"
                placeholder="Enter task title"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label for="task-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="task-description"
                v-model="newTask.description"
                placeholder="Describe the task"
                rows="3"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              ></textarea>
            </div>
            <div>
              <label for="task-project" class="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                id="task-project"
                v-model="newTask.projectId"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              >
                <option value="">Select a project</option>
                <option 
                  v-for="project in store.projects" 
                  :key="project.id" 
                  :value="project.id.toString()"
                >
                  {{ project.title }}
                </option>
              </select>
            </div>
            <div>
              <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                id="task-priority"
                v-model="newTask.priority"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label for="task-due" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                id="task-due"
                v-model="newTask.dueDate"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showTaskModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Task
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
import { Plus, CheckSquare, Filter, Search } from 'lucide-vue-next'
import { useCodequestsStore } from '../stores/codequests'

const store = useCodequestsStore()

const showTaskModal = ref(false)
const newTask = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  projectId: ''
})

function addTask() {
  if (newTask.value.title.trim()) {
    store.addTask(newTask.value)
    newTask.value = {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      projectId: ''
    }
    showTaskModal.value = false
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false
  return new Date(task.dueDate) < new Date()
}

function getProjectForTask(task) {
  return store.projects.find(p => p.id.toString() === task.projectId)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>

