<template>
  <div class="messages-section">
    <Header title="project comments" />
    <div class="messages-list">
      <div v-for="msg in messages" :key="msg.id" class="message-card">
        <p><strong>{{ msg.sender.name }}:</strong> {{ msg.message }}</p>
      </div>
    </div>
    <form @submit.prevent="submitMessage" class="message-form">
      <textarea v-model="newMessage" placeholder="Comment here" required></textarea>
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessagesApi } from '~/composables/api/messages'

const props = defineProps<{
  projectId: number
  userId: number
}>()

const { getMessages, sendMessage } = useMessagesApi()
const messages = ref<any[]>([])
const newMessage = ref('')

const fetchMessages = async () => {
  try {
    messages.value = await getMessages(props.projectId)
  } catch (err) {
    console.error('Error cargando mensajes', err)
  }
}

const submitMessage = async () => {
  try {
    await sendMessage({
      project_id: props.projectId,
      sender_id: props.userId,
      message: newMessage.value
    })
    newMessage.value = ''
    await fetchMessages()
  } catch (err) {
    console.error('Error enviando mensaje', err)
  }
}

onMounted(fetchMessages)
</script>

<style scoped>
.messages-section {
  margin-top: 2rem;
  padding-right: 2.5rem;
}

.message-card {
  background: #eef0f7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-form textarea {
  resize: none;
  height: 100px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.message-form button {
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  background-color: #4682B4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
