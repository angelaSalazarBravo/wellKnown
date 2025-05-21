<template>
  <div class="header">
    <p>{{ title }}</p>
  </div>
  <div class="header-line"></div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped> 
@font-face {
  font-family: 'title';
  src: url('/fonts/Title.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
.header {
  top: 0;
  right: 0;
  left: 0;
  height: 3em;
  overflow: hidden;
  padding: 0.5em;
  color: #31539b;
  line-height: 1.2;
}
p {
  font-family : title;
  font-size: 1.5em;
  font-weight: bold;
}
.header-line {
  width: 97%;
  height: 4px; /* usa px para una línea clara */
  background-color: #000000;
  margin-top: 0.25rem;
}
</style>
