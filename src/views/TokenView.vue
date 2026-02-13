<template>
  <div class="token-container">
    <div class="custom-card">
      <h2 class="custom-title">TOKEN</h2>
      
      <form @submit.prevent="generarToken">
        <div class="form-group mb-3">
          <label class="fw-bold mb-1">Usuario</label>
          <input type="text" v-model="username" class="form-control" required placeholder="Ingrese usuario" />
        </div>
        
        <div class="form-group mb-3">
          <label class="fw-bold mb-1">Password</label>
          <input type="password" v-model="password" class="form-control" required placeholder="Ingrese password" />
        </div>

        <div class="form-group mb-3">
            <label class="fw-bold mb-1">Rol</label>
            <input type="text" v-model="rol" class="form-control" required placeholder="Ingrese rol (ej. admin)" />
        </div>
        
        <div class="form-group mb-3">
            <label class="fw-bold mb-1">Token</label>
            <textarea v-model="token" class="form-control" rows="4" readonly></textarea>
        </div>

        <button type="submit" :disabled="isLoading" class="btn-custom mt-3">
          {{ isLoading ? 'Generando...' : 'Generar' }}
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
            rol: '',
            token: '',
            error: '',
            isLoading: false
        };
    },
    methods: {
        async generarToken() {
            if (this.isLoading) return;
            this.isLoading = true;
            this.error = '';
            this.token = '';

            try {
                // Assuming the auth service runs on 8082 as seen in Login.vue
                const response = await axios.get('http://localhost:8082/auth/token', {
                    params: {
                        user: this.username,
                        password: this.password,
                        rol: this.rol
                    }
                });

                if (response.data && response.data.accessToken) {
                    this.token = response.data.accessToken;
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    this.error = 'Credenciales incorrectas.';
                } else {
                    this.error = 'Error al generar token.';
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
.token-container {
    display: flex;
    justify-content: center;
    padding-top: 50px;
}
.custom-card {
    /* Ensure the card has the white background and shadow defined in App.vue, 
       just adding specific width if needed, or relying on App.vue defaults. 
       App.vue .custom-card has max-width 600px. 
       The exam image shows a narrower card, maybe 400px? 
       Let's stick to App.vue default or slightly override if it looks too wide. */
    width: 100%; 
    max-width: 450px; /* Slightly narrower for Token view as per image */
}
.form-group {
    margin-bottom: 20px;
}
.error-msg {
    color: #e74c3c;
    text-align: center;
    font-weight: bold;
}
label {
    display: block;
    margin-bottom: 8px;
    font-weight: 700;
    color: var(--secondary-color); /* Matches the blue-ish text in image */
    font-size: 1.05rem;
}
.form-control {
    border-radius: 12px; /* Rounded corners as per image */
    border: 1px solid #ced4da;
    padding: 12px;
}
.form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}
.btn-custom {
    border-radius: 12px; /* Rounded button */
    padding: 12px;
    font-size: 1.1rem;
    margin-top: 10px;
}
h2.custom-title {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--secondary-color); /* Ensure title is the dark blue */
}
</style>
