<template>
    <div>
    </div>
  
    <body>
       <div>
        <Sidebar></Sidebar>
       </div>
    </body>
</template>
<script setup>
import Header from '~/components/Header.vue'
import Sidebar from '~/components/SideBar.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    console.log('esto ocurre')
  }
})
</script>
