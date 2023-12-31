// src/services/authService.js
let authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTkwYzEzNjQ4ZGQ2ZTYzMTYyMGI3MDIiLCJ1c2VybmFtZSI6InlvdXJVc2VybmFtZSIsImlhdCI6MTcwNDAwMTY1OCwiZXhwIjoxNzA0MDA1MjU4fQ.eDqOgrQ6aKvArKtQZknH4Sm9vO_2cUIm7ykUGrJAaAQ';

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;
