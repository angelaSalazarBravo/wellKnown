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

    <div v-if="user?.role === 'admin'" class="mt-8">
      <h2 class="text-xl font-bold mb-2">Users</h2>

      <button @click="openCreateUserModal" class="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add User
      </button>

      <table class="w-full table-auto border">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Email</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t">
            <td class="px-4 py-2">{{ u.id }}</td>
            <td class="px-4 py-2">{{ u.name }}</td>
            <td class="px-4 py-2">{{ u.email }}</td>
            <td class="px-4 py-2">
              <button @click="deleteUserById(u.id)" class="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="text-lg font-bold mb-2">Create New User</h3>
        <form @submit.prevent="handleCreateUser">
          <label class="block mt-2">Name:</label>
          <input v-model="newUser.name" required class="input" />

          <label class="block mt-2">Email:</label>
          <input type="email" v-model="newUser.email" required class="input" />

          <label class="block mt-2">Password:</label>
          <input type="password" v-model="newUser.password" required class="input" />

          <label class="block mt-2">Role:</label>
          <select v-model="newUser.role" class="input" required>
            <option value="admin">Admin</option>
            <option value="worker">Worker</option>
          </select>

          <div class="flex justify-end gap-2 mt-4">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
            <button type="button" @click="showModal = false" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
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

const { getUsers, deleteUser, createUser } = useUsersApi()
const router = useRouter()

const user = ref(null)
const users = ref([])
const showModal = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'worker'
})

onMounted(async () => {
  const userData = localStorage.getItem('user')
  if (!userData) {
    router.push('/login')
    return
  }

  user.value = JSON.parse(userData)

  if (user.value?.role === 'admin') {
    await fetchUsers()
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
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
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
</style>
