<template>
  <div class="register-container">
    <h1>Create Account</h1>
    <form @submit.prevent="registerUserFn" class="register-form">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input
        v-model="passwordConfirmation"
        type="password"
        placeholder="Confirm Password"
        required
      />
      <select v-model="role" required>
        <option disabled value="">Select a role</option>
        <option value="admin">Admin</option>
        <option value="worker">Worker</option>
      </select>
      <button type="submit">Create Account</button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <p class="text-center mt-2">
      Already have an account?
      <router-link to="/login">Login here</router-link>
    </p>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersApi } from '~/composables/api/users'
const {createUser} = useUsersApi()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const role = ref('')
const errorMessage = ref('')
const router = useRouter()

const registerUserFn = async () => {
  errorMessage.value = ''

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value
  }

  const { data, error } = await createUser(userData)

  if (error.value) {
    errorMessage.value = error.value.message || 'Error al crear el usuario.'
    return
  }

  const token = data.value?.accessToken || data.value?.data?.accessToken
  const user = data.value?.user || data.value?.data?.user

  if (token) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/')
  } else {
    errorMessage.value = 'Usuario creado, pero no se recibió token.'
  }
}
</script>

<style scoped>
.register-container {
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 350px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form input,
.register-form select {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.register-form input:focus,
.register-form select:focus {
  border-color: #69caf0;
  outline: none;
}

.register-form button {
  padding: 0.5rem;
  background-color: #4682b4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.register-form button:hover {
  background-color: #5a9bd4;
}

.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}
</style>
