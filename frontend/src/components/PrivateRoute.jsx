// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import { getAuthToken } from '../services/authServices';
import TodoList from './TodoList';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!getAuthToken();

  return isAuthenticated ? (
	<Routes>
    <Route path='/' element={<TodoList />} />
	</Routes>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
