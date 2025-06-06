<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Iniciar sesión</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>

    <p class="text-center mt-2">
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsersApi } from '~/composables/api/users'


const email = ref('')
const password = ref('')
const error = ref('')
const { loginUser } = useUsersApi()
const router = useRouter()

const handleLogin = async () => {
  const { data, error: loginError } = await loginUser(email.value, password.value)

  if (loginError.value) {
    error.value = 'Error al iniciar sesión'
    console.error(loginError.value)
  } else {
    const token = data.value?.data?.accessToken
    console.log('Token generado:', token)

    if (token) {
      localStorage.setItem('authToken', token)
      router.push('/')
    } else {
      error.value = 'Token no recibido del servidor'
    }
  }
}


</script>


<style scoped>
.login-container {
  padding: 1rem;
  background-color: #ffffff; 
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.login-form input:focus {
  border-color: #69caf0; 
  outline: none;
}

.login-form button {
  padding: 0.5rem;
  background-color: #4682B4; 
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.login-form button:hover {
  background-color: #5a9bd4; 
}

.error-message {
  color: #d9534f; 
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}
</style>
