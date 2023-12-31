// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/register', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>Username:</label>
        <input type="text" name="username" onChange={handleInputChange} />

        <label>Email:</label>
        <input type="email" name="email" onChange={handleInputChange} />

        <label>Password:</label>
        <input type="password" name="password" onChange={handleInputChange} />

        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
