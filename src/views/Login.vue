<template>
  <div class="login-container">
    <div class="custom-card" style="width: 100%; max-width: 400px;">
      <h2 class="custom-title">Login</h2>
      
      <form @submit.prevent="login">
        <div class="form-group mb-3">
          <label class="fw-bold mb-1">Usuario</label>
          <input type="text" v-model="username" class="form-control" required placeholder="Ingrese su usuario" />
        </div>
        
        <div class="form-group mb-3">
          <label class="fw-bold mb-1">Contraseña</label>
          <input type="password" v-model="password" class="form-control" required placeholder="Ingrese su contraseña" />
        </div>
        
        <button type="submit" :disabled="isLoading" class="btn-custom mt-3">
          {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
        </button>
        
        <p v-if="error" class="error-msg mt-3">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      isLoading: false
    };
  },
  methods: {
    async login() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.error = '';
      
      console.log("Solicitando token...");

      try {
        const response = await axios.get('http://localhost:8082/auth/token', {
          params: {
            user: this.username,
            password: this.password
          }
        });

        if (response.data && response.data.accessToken) {
             console.log("Token obtenido exitosamente.");
            const token = response.data.accessToken;
            localStorage.setItem('token', token);
            localStorage.setItem('role', response.data.role); 
            this.$router.push('/');
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          this.error = 'Credenciales incorrectas. Inténtelo de nuevo.';
        } else {
          this.error = 'Error de conexión con el servidor.';
        }
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

.error-msg {
  color: #e74c3c;
  text-align: center;
  font-size: 0.9rem;
}
</style>
