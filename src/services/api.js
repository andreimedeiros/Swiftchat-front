import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Certifique-se que o backend está rodando nessa porta
});

export default api;
