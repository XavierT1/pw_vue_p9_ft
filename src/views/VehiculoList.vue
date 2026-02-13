<template>
  <div class="container mt-4">
    <div class="header-actions text-center mb-4">
      <h1 class="custom-title">Inventario de Vehículos</h1>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-msg mb-4">
      {{ error }}
    </div>

    <div class="row" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <!-- Vehicle List -->
        <div class="custom-card" style="flex: 2; min-width: 400px;">
           <h3 class="custom-title" style="font-size: 1.4rem;">Lista de Vehículos</h3>
           <div style="overflow-x: auto;">
             <table class="table" style="width: 100%; border-collapse: collapse;">
              <thead style="background-color: #f8f9fa;">
                <tr>
                  <th style="padding: 12px; text-align: left;">Placa</th>
                  <th style="padding: 12px; text-align: left;">Marca</th>
                  <th style="padding: 12px; text-align: left;">Modelo</th>
                  <th style="padding: 12px; text-align: left;">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in vehiculos" :key="v.id" style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 12px;">{{ v.placa }}</td>
                  <td style="padding: 12px;">{{ v.marca }}</td>
                  <td style="padding: 12px;">{{ v.modelo }}</td>
                  <td style="padding: 12px;">
                    <button class="btn-visualizar" @click="visualizar(v)" style="padding: 5px 10px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Visualizar</button>
                  </td>
                </tr>
              </tbody>
            </table>
           </div>
        </div>

        <!-- Details / Create Section -->
        <div style="flex: 1; min-width: 300px;">
             <!-- Details -->
            <div v-if="selectedVehiculo" class="custom-card mb-4" style="margin-bottom: 20px;">
              <h3 class="custom-title" style="font-size: 1.3rem;">Detalles del Vehículo</h3>
              <div class="form-group mb-2">
                <label>Placa</label>
                <input type="text" :value="selectedVehiculo.placa" disabled class="form-control">
              </div>
              <div class="form-group mb-2">
                <label>Marca</label>
                <input type="text" :value="selectedVehiculo.marca" disabled class="form-control">
              </div>
              <div class="form-group mb-2">
                <label>Modelo</label>
                <input type="text" :value="selectedVehiculo.modelo" disabled class="form-control">
              </div>
              <div class="form-group mb-2">
                <label>Color</label>
                <input type="text" :value="selectedVehiculo.color" disabled class="form-control">
              </div>
            </div>

            <!-- Create -->
            <div class="custom-card">
              <h3 class="custom-title" style="font-size: 1.3rem;">Agregar Nuevo</h3>
              <form @submit.prevent="crearVehiculo">
                <div class="form-group mb-2">
                  <label class="fw-bold">Placa</label>
                  <input type="text" v-model="newVehiculo.placa" required class="form-control">
                </div>
                <div class="form-group mb-2">
                  <label class="fw-bold">Marca</label>
                  <input type="text" v-model="newVehiculo.marca" required class="form-control">
                </div>
                <div class="form-group mb-2">
                  <label class="fw-bold">Modelo</label>
                  <input type="text" v-model="newVehiculo.modelo" required class="form-control">
                </div>
                <div class="form-group mb-2">
                  <label class="fw-bold">Color</label>
                  <input type="text" v-model="newVehiculo.color" required class="form-control">
                </div>
                <button type="submit" class="btn-custom mt-3">Guardar</button>
              </form>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VehiculoList',
  data() {
    return {
      vehiculos: [],
      selectedVehiculo: null,
      error: null,
      newVehiculo: {
        placa: '',
        marca: '',
        modelo: '',
        color: ''
      }
    }
  },
  async mounted() {
    await this.fetchVehiculos();
  },
  methods: {
    async fetchVehiculos() {
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8081/vehiculos/api/v1.0/vehiculos');
        this.vehiculos = response.data;
      } catch (error) {
        console.error("Error fetching vehicles", error);
        this.handleError(error);
      }
    },
    async visualizar(vehiculo) {
      const selfLink = vehiculo.links.find(l => l.rel === 'self');
      if (selfLink) {
        try {
          const response = await axios.get(selfLink.href);
          this.selectedVehiculo = response.data;
        } catch (error) {
           this.handleError(error);
        }
      }
    },
    async crearVehiculo() {
      try {
        await axios.post('http://localhost:8081/vehiculos/api/v1.0/vehiculos', this.newVehiculo);
        this.newVehiculo = { placa: '', marca: '', modelo: '', color: '' };
        await this.fetchVehiculos(); 
      } catch (error) {
        this.handleError(error);
      }
    },
    handleError(error) {
         if (error.response && error.response.status === 401) {
             // Interceptor handles logging out, but valid to have backup
             this.error = "Sesión expirada.";
        } else {
             this.error = "Error de conexión o permisos insuficientes.";
        }
    }
  }
}
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
}
.error-msg {
    color: red;
    text-align: center;
    background: #ffe6e6;
    padding: 10px;
    border-radius: 4px;
}
</style>
