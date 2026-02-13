<template>
  <div id="app">
    <nav class="simple-nav" v-if="$route.path !== '/login'">
      <div class="nav-links">
        <router-link to="/token" class="nav-link-item" active-class="active">Consultar Token</router-link>
        <span class="nav-separator">|</span>
        <router-link to="/" class="nav-link-item" active-class="active">Vehículos</router-link>
        <span class="nav-separator">|</span>
        <a href="#" @click.prevent="logout" class="nav-link-item logout-link">Cerrar Sesión</a>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      console.log("Cerrando sesión...");
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.$router.push('/login');
    }
  }
}
</script>

<style>
:root {
  --primary-color: #4CAF50; /* Green/Teal */
  --secondary-color: #2c3e50; /* Dark Blue/Grey */
  --bg-color: #ffffff;
  --text-color: #333;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  min-height: 100vh;
}

/* Navigation Styles */
.simple-nav {
  padding: 20px 0;
  text-align: center;
  margin-bottom: 30px;
}

.nav-links {
  display: inline-flex;
  gap: 15px;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
}

.nav-link-item {
  text-decoration: none;
  color: var(--secondary-color);
  transition: color 0.2s;
}

.nav-link-item:hover {
  text-decoration: underline;
  color: var(--primary-color);
  opacity: 1;
}

.nav-link-item.active {
  color: var(--secondary-color);
  font-weight: 400; /* Normal weight */
  text-decoration: underline;
}

.nav-link-item.logout-link {
  color: var(--secondary-color);
}

.nav-separator {
  color: #333;
  font-weight: 400;
}

/* Global Card & Form Styles */
.custom-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 30px;
  border: 1px solid #f0f0f0;
  max-width: 600px; /* Default width */
  margin: 0 auto;
}

.custom-title {
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 1.8rem;
}

.form-control {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ced4da;
  padding: 10px;
  box-sizing: border-box; /* Important for full width */
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(76, 175, 80, 0.25);
  outline: none;
}

.btn-custom {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  font-weight: 600;
  transition: opacity 0.2s;
  cursor: pointer;
}

.btn-custom:hover {
  opacity: 0.9;
  color: white;
}
</style>
