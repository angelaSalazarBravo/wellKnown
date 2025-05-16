<template>
    <div class="auth-container">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <div>
          <label for="name">Name</label>
          <input v-model="name" type="text" id="name" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <div>
          <label for="password_confirmation">Confirm Password</label>
          <input v-model="passwordConfirmation" type="password" id="password_confirmation" required />
        </div>
        <button type="submit">Register</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p>Already have an account? <router-link to="/login">Login</router-link></p>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUsersApi } from '@/composables/api/users';
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const passwordConfirmation = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  const { registerUser } = useUsersApi();
  
  const registerUserFn = async () => {
    if (password.value !== passwordConfirmation.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
  
    const { data, error } = await registerUser(name.value, email.value, password.value);
  
    if (error.value) {
      errorMessage.value = error.value.message || 'Registration failed. Please try again.';
    } else {
      localStorage.setItem('auth_token', data.value.data.accessToken);
      router.push('/');
    }
  };
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  .error {
    color: red;
  }
  </style>
  