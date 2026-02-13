<template>
  <div class="vehiculo-view">
    <VehiculoForm @token-changed="onTokenChanged" @vehiculo-guardado="onVehiculoGuardado" />
    <VehiculoList :token="token" :refreshTrigger="refreshTrigger" />
  </div>
</template>

<script>
import VehiculoForm from '../components/VehiculoForm.vue';
import VehiculoList from '../components/VehiculoList.vue';

export default {
  components: {
    VehiculoForm,
    VehiculoList
  },
  data() {
    return {
      token: '',
      refreshTrigger: 0
    };
  },
  methods: {
    onTokenChanged(newToken) {
        this.token = newToken;
    },
    onVehiculoGuardado(token) {
        this.token = token;
        this.refreshTrigger++;
    }
  }
};
</script>

<style scoped>
.vehiculo-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
}
</style>
