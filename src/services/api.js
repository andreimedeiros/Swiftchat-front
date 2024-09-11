import axios from 'axios';




// Criar uma instância de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Adicionar um interceptador para incluir o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token JWT:aaaaa', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export default api;
