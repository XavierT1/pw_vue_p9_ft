import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// --- GLOBAL TOKEN LOGGING & INTERCEPTORS ---
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        console.log("Token activo, enviando petición...");
        
        try {
             const base64Url = token.split('.')[1];
             const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
             const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                 return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
             }).join(''));

             const decoded = JSON.parse(jsonPayload);
             const now = Math.floor(Date.now() / 1000);
             const timeLeft = decoded.exp - now;
             
             if (timeLeft < 300) {
                 console.warn("ALERTA: El token está por expirar en menos de 5 minutos.");
             }
        } catch (e) {
            // Ignore decode error
        }
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Token expirado o inválido.");
            localStorage.removeItem('token');
            localStorage.removeItem('role');

            if (window.location.pathname !== '/login') {
                console.log("Su sesión ha expirado o no tiene permisos. Por favor inicie sesión nuevamente.");
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
// -------------------------------------------

createApp(App).use(router).mount('#app')
