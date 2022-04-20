import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-sga-dev.pm.ce.gov.br',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNjY1NjgzODI2IiwibmFtZSI6InNpc2ZhcmQiLCJpYXQiOjE2NjU2ODM4MjZ9.e70i7XTGUM64hkLnEOZD6U-AsqM6Zbm9prycjWW0iI0`,
  },
});

export default api;
