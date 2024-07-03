import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.33.45.77:5000/api', // Replace with your backend URL
});

export default instance;
