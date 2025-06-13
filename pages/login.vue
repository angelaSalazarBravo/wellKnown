<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <input v-model="email" type="email" placeholder="Enter your email" />
      <input v-model="password" type="password" placeholder="Enter your password" />
      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error-message">{{ error }}</p>

    <p class="text-center mt-2">
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>

    <p class="text-center mt-2">
      <a href="#" @click.prevent="showForgot = !showForgot">Forgot your password?</a>
    </p>

    <div v-if="showForgot" class="mt-4">
      <input v-model="forgotEmail" type="email" placeholder="Enter your email" />

      <button class="btn-add" @click="requestResetToken">Generate token</button>

      <p v-if="resetToken" class="token-message">
        Token: <strong>{{ resetToken }}</strong>
      </p>

      <div class="mt-3">
        <input v-model="newPassword" type="password" placeholder="New password" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm password" />
        <input v-model="token" placeholder="Paste the token here" />
        <button @click="resetPassword">Change password</button>
        <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
        <p v-if="resetError" class="error-message">{{ resetError }}</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useUsersApi } from '~/composables/api/users'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loginUser, generateResetToken, resetPasswordRequest } = useUsersApi()

// Login
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  const { data, error: loginError } = await loginUser(email.value, password.value)
  if (loginError.value) {
    error.value = 'Error al iniciar sesión'
  } else {
    const token = data.value?.data?.accessToken
    if (token) {
      localStorage.setItem('authToken', token)
      router.push('/')
    } else {
      error.value = 'Token no recibido del servidor'
    }
  }
}

// Forgot password
const showForgot = ref(false)
const forgotEmail = ref('')
const resetToken = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const token = ref('')
const resetError = ref('')
const successMessage = ref('')

const requestResetToken = async () => {
  const { data, error } = await generateResetToken(forgotEmail.value)

  if (error.value) {
    resetError.value = 'Error al generar token'
    resetToken.value = ''
  } else {
    resetToken.value = data.value.token
    console.log('Token recibido del servidor:', data.value)
    resetError.value = ''
  }
}


const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    resetError.value = 'Las contraseñas no coinciden'
    return
  }

  const { data, error } = await resetPasswordRequest({
    email: forgotEmail.value,
    password: newPassword.value,
    password_confirmation: confirmPassword.value,
    token: token.value
  })

  if (error.value) {
    resetError.value = data.value?.message || 'Error al cambiar la contraseña'
  } else {
    successMessage.value = 'Contraseña cambiada correctamente'
    resetError.value = ''
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

.mt-4 {
  margin-top: 1rem;
}

.mt-3 {
  margin-top: 0.75rem;
}


.mt-4 input,
.mt-3 input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.3s;
}

.mt-4 input:focus,
.mt-3 input:focus {
  border-color: #69caf0;
  outline: none;
}


.mt-4 button,
.mt-3 button {
  margin-top: 5%;
  padding: 0.5rem;
  background-color: #4682B4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s;
}

.mt-4 button:hover,
.mt-3 button:hover {
  background-color: #5a9bd4;
}

.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
}
.token-message {
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 5px;
  margin: 1rem 0;
  font-size: 0.95rem;
  color: #333;
  word-break: break-all;
  text-align: center;
}

</style>
