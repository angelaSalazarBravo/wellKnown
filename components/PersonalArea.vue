<template>
  <div>
    <Header title="Personal Area" />

    <div v-if="user">
      <h2 class="text-xl font-bold mt-4">My Profile</h2>
      <div class="p-4 border rounded mt-2">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
      </div>
    </div>
    <button @click="logout" class="btn-add mt-2">
      Logout
    </button>

    <div v-if="user?.role === 'admin'" class="mt-8">
      <Header title="Users" />

      <button @click="openCreateUserModal" class="btn-add">
        Add User
      </button>

      <table class="w-full table-auto border">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Role</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t">
            <td class="px-4 py-2">{{ u.id }}</td>
            <td class="px-4 py-2">{{ u.name }}</td>
            <td class="px-4 py-2">{{ u.email }}</td>
            <td class="px-4 py-2">{{ u.role }}</td>
            <td class="px-4 py-2">
              <button class="btn-add" @click="deleteUserById(u.id)">Delete</button>
              <button class="btn-add" @click="editUserById(u.id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>

    <div v-if="isLoading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    </div>

<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h3 class="text-lg font-bold mb-4">
      {{ isEditMode ? 'Edit User' : 'Create New User' }}
    </h3>
    <form @submit.prevent="isEditMode ? handleUpdateUser() : handleCreateUser()">
      <label class="block mt-2">Name:</label>
      <input v-model="newUser.name" required class="input" />

      <label class="block mt-2">Email:</label>
      <input type="email" v-model="newUser.email" required class="input" />

      <label class="block mt-2">Password:</label>
      <input
        type="password"
        v-model="newUser.password"
        :required="!isEditMode"
        class="input"
      />

      <label class="block mt-2">Role:</label>
      <select v-model="newUser.role" class="input" required>
        <option value="admin">Admin</option>
        <option value="worker">Worker</option>
      </select>

      <div class="flex justify-end gap-2 mt-4">
        <button type="submit" class="btn-add">
          {{ isEditMode ? 'Update' : 'Create' }}
        </button>
        <button
          type="button"
          @click="showModal = false"
          class="btn-add"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '~/components/Header.vue'
import { useUsersApi } from '~/composables/api/users'
import { useRouter } from 'vue-router'

const { getUsers, deleteUser, createUser, updateUser } = useUsersApi()
const router = useRouter()

const user = ref(null)
const users = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const editingUserId = ref(null)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'worker'
})
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token') 
  router.push('/login')
}


onMounted(async () => {
  isLoading.value = true
  try {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    user.value = JSON.parse(userData)

    if (user.value?.role === 'admin') {
      await fetchUsers()
    }
  } catch (err) {
    console.error('Error loading user or users:', err)
    if (err?.status === 401) {
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
})

const fetchUsers = async () => {
  const { data, error } = await getUsers()
  if (!error.value) {
    users.value = Array.isArray(data.value) ? data.value : data.value?.data || []
  } else {
    console.error('Failed to fetch users:', error.value)
  }
}

const deleteUserById = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  const { error } = await deleteUser(id)
  if (!error.value) {
    users.value = users.value.filter(u => u.id !== id)
  } else {
    alert('Error deleting user')
  }
}

const openCreateUserModal = () => {
  newUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'worker'
  }
  isEditMode.value = false
  showModal.value = true
}

const editUserById = (id) => {
  const selected = users.value.find(u => u.id === id)
  if (!selected) return

  newUser.value = {
    name: selected.name,
    email: selected.email,
    password: '',
    role: selected.role
  }

  editingUserId.value = id
  isEditMode.value = true
  showModal.value = true
}

const handleCreateUser = async () => {
  const { error } = await createUser(newUser.value)
  if (!error.value) {
    showModal.value = false
    await fetchUsers()
  } else {
    alert('Error creating user')
    console.error(error.value)
  }
}

const handleUpdateUser = async () => {
  const payload = { ...newUser.value }
  if (!payload.password) delete payload.password

  const { error } = await updateUser(editingUserId.value, payload)
  if (!error.value) {
    showModal.value = false
    editingUserId.value = null
    await fetchUsers()
  } else {
    alert('Error updating user')
    console.error(error.value)
  }
}
</script>


<style scoped>
table {
  border-collapse: collapse;
  width: 90%;
}

th, td {
  border: 1px solid #ccc;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #4682B4;
  color: white; 
}



tr:hover {
  background-color:rgb(164, 204, 236);
}

.input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}
.btn-add {
  background-color: #4682B4;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  margin-bottom:2% ;
  margin-top: 2%;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* o el alto que desees mientras carga */
}

.spinner {
  border: 4px solid #cce6ff;
  border-top: 4px solid #4682B4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
