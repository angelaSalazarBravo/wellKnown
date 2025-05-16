<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Iniciar sesión</button>
    </form>
    <p v-if="error">{{ error }}</p>
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
    console.log('Usuario autenticado:', data.value)
    router.push('/')
  }
}
</script>