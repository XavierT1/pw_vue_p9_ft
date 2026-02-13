<template>
  <div class="custom-card full-width mt-4">
    <h3 class="custom-title">Lista de Vehículos</h3>
    <p v-if="deleteMessage" :class="{'success-msg': deleteSuccess, 'error-msg': !deleteSuccess}" class="text-center feedback-msg">{{ deleteMessage }}</p>
    
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Placa</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Chasis</th>
          <th>F. Fabricación</th>
          <th>F. Matrícula</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in vehiculos" :key="v.placa">
          <td>{{ v.id }}</td>
          <td>{{ v.placa }}</td>
          <td>{{ v.marca }}</td>
          <td>{{ v.modelo }}</td>
          <td>{{ v.chasis }}</td>
          <td>{{ v.fechaFabricacion }}</td>
          <td>{{ v.fechaMatricula }}</td>
          <td>
            <button @click="eliminar(v.placa)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
        <tr v-if="vehiculos.length === 0">
            <td colspan="8" class="text-center">No hay vehículos o no se ha cargado la lista (requiere token).</td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    token: {
        type: String,
        required: false
    },
    refreshTrigger: {
        type: Number,
        default: 0
    }
  },
  data() {
    return {
      vehiculos: [],
      error: '',
      deleteMessage: '',
      deleteSuccess: false
    };
  },
  watch: {
    token(newVal) {
        if (newVal) {
            this.listar();
        }
    },
    refreshTrigger() {
        // Triggered when a new vehicle is saved
        if (this.token) {
            this.listar();
        }
    }
  },
  mounted() {
      if (this.token) {
          this.listar();
      }
  },
  methods: {
    async listar() {
      this.error = '';
      try {
        const response = await axios.get('http://localhost:8081/vehiculos/api/v1.0/vehiculos', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.vehiculos = response.data;
      } catch (err) {
        console.error(err);
        this.error = 'Error al cargar vehículos. Verifique el token.';
      }
    },
    async eliminar(placa) {
        /*
          "solo con lo que emos aprendido sin usar alert"
          I will skip confirm dialog if not supposed to use alerts/native dialogs?
          Or maybe just clear message and proceed.
          I'll proceed directly to delete.
        */
        this.deleteMessage = '';
        try {
            await axios.delete(`http://localhost:8081/vehiculos/api/v1.0/vehiculos/${placa}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            this.deleteMessage = `Vehículo con placa ${placa} eliminado exitosamente.`;
            this.deleteSuccess = true;
            this.listar(); // Refresh list
        } catch (err) {
            console.error(err);
            this.deleteMessage = 'Error al eliminar. Verifique permisos (admin requerido).';
            this.deleteSuccess = false;
        }
    }
  }
};
</script>

<style scoped>
.full-width {
    max-width: 100% !important;
    overflow-x: auto;
}
.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}
.table th, .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
.table th {
    background-color: #f2f2f2;
    font-weight: bold;
}
.btn-delete {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}
.btn-delete:hover {
    background-color: #c0392b;
}
.error-msg { color: red; text-align: center; margin-top: 10px; font-weight: bold;}
.success-msg { color: green; text-align: center; margin-top: 10px; font-weight: bold;}
.text-center { text-align: center; }
.feedback-msg { margin-bottom: 10px; }
</style>
