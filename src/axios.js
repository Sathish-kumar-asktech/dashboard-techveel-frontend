import axios from 'axios';

const baseURL = 'http://localhost:1999/api/';

const instance = axios.create({
  baseURL,
});

export default {
  instance,
  baseURL,
};
