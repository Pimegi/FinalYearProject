import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.5.2.11:5000/api', // Replace with your backend URL
});

export default instance;
