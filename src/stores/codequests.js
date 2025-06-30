import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCodequestsStore = defineStore('codequests', () => {
  // State
  const ideas = ref([])
  const projects = ref([])
  const tasks = ref([])
  const user = ref(null)

  // Getters
  const indieProjects = computed(() => 
    projects.value.filter(project => project.isIndieProject)
  )

  const regularProjects = computed(() => 
    projects.value.filter(project => !project.isIndieProject)
  )

  const completedTasks = computed(() => 
    tasks.value.filter(task => task.completed)
  )

  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )

  const overdueTasks = computed(() => 
    tasks.value.filter(task => {
      if (!task.dueDate || task.completed) return false
      return new Date(task.dueDate) < new Date()
    })
  )

  const totalRevenue = computed(() => 
    indieProjects.value.reduce((sum, project) => sum + (project.currentRevenue || 0), 0)
  )

  const totalRevenueGoal = computed(() => 
    indieProjects.value.reduce((sum, project) => sum + (parseInt(project.revenueGoal) || 0), 0)
  )

  // Actions
  function addIdea(idea) {
    const newIdea = {
      id: Date.now(),
      ...idea,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ideas.value.push(newIdea)
  }

  function updateIdea(id, updates) {
    const index = ideas.value.findIndex(idea => idea.id === id)
    if (index !== -1) {
      ideas.value[index] = {
        ...ideas.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function deleteIdea(id) {
    const index = ideas.value.findIndex(idea => idea.id === id)
    if (index !== -1) {
      ideas.value.splice(index, 1)
    }
  }

  function addProject(project) {
    const newProject = {
      id: Date.now(),
      ...project,
      isIndieProject: project.isIndieProject || false,
      status: project.status || 'active',
      currentRevenue: project.currentRevenue || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects.value.push(newProject)
  }

  function updateProject(id, updates) {
    const index = projects.value.findIndex(project => project.id === id)
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function deleteProject(id) {
    const index = projects.value.findIndex(project => project.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
      // Also delete related tasks
      tasks.value = tasks.value.filter(task => task.projectId !== id.toString())
    }
  }

  function promoteToIndieProject(projectId) {
    updateProject(projectId, { 
      isIndieProject: true,
      status: 'brainstorming' // Start in brainstorming phase for indie projects
    })
  }

  function addTask(task) {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.value.push(newTask)
  }

  function updateTask(id, updates) {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function toggleTask(id) {
    const task = tasks.value.find(task => task.id === id)
    if (task) {
      updateTask(id, { completed: !task.completed })
    }
  }

  function deleteTask(id) {
    const index = tasks.value.findIndex(task => task.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  function getProjectProgress(projectId) {
    const projectTasks = tasks.value.filter(task => task.projectId === projectId.toString())
    if (projectTasks.length === 0) return 0
    const completed = projectTasks.filter(task => task.completed)
    return Math.round((completed.length / projectTasks.length) * 100)
  }

  function setUser(userData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  // Initialize with some sample data for development
  function initializeSampleData() {
    if (ideas.value.length === 0) {
      addIdea({
        title: 'AI-Powered Code Review Tool',
        description: 'A SaaS tool that uses AI to automatically review code commits, suggest improvements, and catch potential bugs before they reach production.',
        potential: 'high'
      })
    }
  }

  return {
    // State
    ideas,
    projects,
    tasks,
    user,
    // Getters
    indieProjects,
    regularProjects,
    completedTasks,
    pendingTasks,
    overdueTasks,
    totalRevenue,
    totalRevenueGoal,
    // Actions
    addIdea,
    updateIdea,
    deleteIdea,
    addProject,
    updateProject,
    deleteProject,
    promoteToIndieProject,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    getProjectProgress,
    setUser,
    clearUser,
    initializeSampleData
  }
})

