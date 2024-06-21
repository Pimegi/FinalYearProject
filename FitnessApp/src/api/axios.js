import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:5000/api', // Replace with your backend URL
});

export default instance;
