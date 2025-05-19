<template>
  <div class="landing-page">
  <div class="headline-banner">
    <h2>Un entorno de trabajo donde la comunicación es lo primero</h2>
  </div>
  <div class="landing-section">
    <div class="text-block">
      <p>
        <strong>Well Known</strong> facilita una comunicación fluida y eficiente en equipos de desarrollo de software.
        Optimiza la gestión de reuniones, fomenta la colaboración y permite el intercambio rápido de recursos,
        mejorando la productividad y el trabajo en equipo.
      </p>
    </div>
    <div class="image-block">
      <img src="/images/landing.jpg" alt="Ilustración de trabajo en equipo" />
    </div>
  </div>
<div class="mid-banner">
  <img src="/images/wk1.png" alt="Imagen de Well Known" />
  <div class="text-overlay">
    <h2>Contáctanos</h2>
    <p>Descubre cómo trabajar con Well Known</p>
  </div>
</div>
<div class="mid-banner">
  <img src="/images/landing2.png" alt="Imagen de Well Known" />
</div>
</div> 

</template>

<script setup>
</script>

<style scoped>
.landing-page {
    padding-top:0%;
    padding: 4rem;
}
.headline-banner {
  background-color: #dceef9;
  border-radius: 10px;
  padding: 1.5rem;
  max-width: 90%;
  margin: 2rem auto; 
  text-align: center;

}

.headline-banner h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #111111;
}

.mid-banner img {
  border-radius: 8px;
  padding: 0; 
  max-width: 95%;
  margin: 2rem auto;
  display: block; 
  object-fit: cover; 
}
.mid-banner {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  padding: 1rem;
}

.text-overlay h2 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.text-overlay p {
  margin: 0;
  font-size: 1.2rem;
}


.landing-section {
    max-width: 90%;
    margin-left: 10%;
    margin-right: 10%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 2rem;
  gap: 2rem;
}

.text-block {
  flex: 1;
  background-color: #dcebf8;
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
  color: #1a1a1a;
  align-items: stretch;

}
.text-block p {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  height: 100%;
}

.image-block {
  flex: 1;
  display: flex;
  justify-content: center;
}

.image-block img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
