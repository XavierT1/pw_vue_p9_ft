<template>
  <div class="custom-card mb-4" style="max-width: 800px;">
    <h2 class="custom-title">VEHICULO</h2>
    
    <form @submit.prevent="guardar">
      <div class="form-group mb-3">
        <label class="fw-bold mb-1">Token</label>
        <textarea v-model="token" class="form-control" rows="3" required placeholder="Pegue su token aquí"></textarea>
      </div>

      <div class="form-group mb-3">
        <label class="fw-bold mb-1">Marca</label>
        <input type="text" v-model="vehiculo.marca" class="form-control" required />
      </div>

      <div class="form-group mb-3">
        <label class="fw-bold mb-1">Modelo</label>
        <input type="text" v-model="vehiculo.modelo" class="form-control" required />
      </div>

      <div class="form-group mb-3">
        <label class="fw-bold mb-1">Chasis</label>
        <input type="text" v-model="vehiculo.chasis" class="form-control" required />
      </div>
      
      <!-- P2 uses "placa" as ID in delete, but creating seemingly doesn't ask for Placa in the image? 
           The image P2 shows: Marka, Modelo, Chasis, Fecha Fab, Fecha Mat.
           But the Entity has Placa.
           If Placa is not in the form, maybe it's generated? 
           The Entity uses @GeneratedValue for ID, but Placa is usually a business key.
           Let's look at Vehiculo.java again. 
           It has private String placa;
           And standard JPA.
           If the form doesn't input Placa, how is it set?
           Maybe Chasis is used as Placa? Or maybe I missed Placa in the image.
           The image shows: Token, Marca, Modelo, Chasis, Fecha fab, Fecha mat.
           There is NO Placa field in the image (P2).
           However, the delete requirement (P4) says delete by Placa? 
           "Botón que permite eliminar un Vehículo de la lista" & "Eliminar /{placa}" in my previous thought.
           Let's check P3 image. It shows ID, Placa, Marca, Modelo... 
           Ah, I need to check if Placa is auto-generated or if I missed it.
           Checking P2 image again (mental check): The inputs are Token, Marca, Modelo, Chasis, Fecha Fab, Fecha Mat.
           Where does Placa come from?
           Maybe it is generated? Or maybe Chasis is the Placa?
           Or maybe I should add Placa field anyway?
           If I don't send Placa, it will be null unless I generate it.
           I'll add Placa field to be safe, or maybe the user enters it in "Chasis" and I map it?
           No, Chasis is Chasis.
           I'll add a Placa field, or checking the P3 image, it lists Placa.
           If the user doesn't input it, it's a problem.
           I'll add Placa input to the form. It's safer.
           Actually, looking at the image P2 again (if I could), it might be hidden?
           Let's assume I need to add it, or maybe use Chasis as Placa?
           I will add Placa input.
      -->
      <div class="form-group mb-3">
        <label class="fw-bold mb-1">Placa</label>
        <input type="text" v-model="vehiculo.placa" class="form-control" required placeholder="Ingrese Placa" />
      </div>

      <div class="row">
        <div class="col-md-6 form-group mb-3 p-1">
           <label class="fw-bold mb-1">Fecha de fabricación</label>
           <input type="date" v-model="vehiculo.fechaFabricacion" class="form-control" required /> 
        </div>
        <div class="col-md-6 form-group mb-3 p-1">
           <label class="fw-bold mb-1">Fecha de matrícula</label>
           <input type="date" v-model="vehiculo.fechaMatricula" class="form-control" required /> 
        </div>
      </div>

      <button type="submit" :disabled="isSaving" class="btn-custom mt-3">
        {{ isSaving ? 'Guardando...' : 'Guardar' }}
      </button>

      <p v-if="message" :class="{'success-msg': isSuccess, 'error-msg': !isSuccess}" class="mt-2 text-center">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      token: '',
      vehiculo: {
        placa: '',
        marca: '',
        modelo: '',
        chasis: '',
        fechaFabricacion: '',
        fechaMatricula: ''
      },
      isSaving: false,
      message: '',
      isSuccess: false
    };
  },
  watch: {
    token(newVal) {
      this.$emit('token-changed', newVal);
    }
  },
  methods: {
    async guardar() {
      if (this.isSaving) return;
      this.isSaving = true;
      this.message = '';

      try {
        const response = await axios.post('http://localhost:8081/vehiculos/api/v1.0/vehiculos', this.vehiculo, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        this.message = 'Vehículo guardado exitosamente';
        this.isSuccess = true;
        this.limpiarCampos();
        this.$emit('vehiculo-guardado', this.token); // Pass token back to parent to refresh list
      } catch (err) {
        this.isSuccess = false;
        if (err.response && err.response.status === 403) {
           this.message = 'No autorizado (403). Verifique su token y rol.';
        } else if (err.response && err.response.status === 401) {
            this.message = 'Token inválido o expirado (401).';
        } else {
           this.message = 'Error al guardar el vehículo.';
        }
        console.error(err);
      } finally {
        this.isSaving = false;
      }
    },
    limpiarCampos() {
      // Keep the token, clear other fields
      this.vehiculo = {
        placa: '',
        marca: '',
        modelo: '',
        chasis: '',
        fechaFabricacion: '',
        fechaMatricula: ''
      };
    }
  }
};
</script>

<style scoped>
.success-msg { color: green; font-weight: bold;}
.error-msg { color: red; font-weight: bold;}
.row { display: flex; margin: 0 -5px;}
.col-md-6 { flex: 1; padding: 0 5px; }
</style>
