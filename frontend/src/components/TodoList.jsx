import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthToken } from '../services/authServices';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/todos', {
        headers: {
          Authorization: getAuthToken(),
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInputChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async () => {
    try {
      await axios.post(
        'http://localhost:8080/todos',
        { ...newTodo },
        {
          headers: {
            Authorization: getAuthToken(),
          },
        }
      );
      setNewTodo({ title: '', description: '' });
      fetchTodos()// Call the fetchTodos function here
    } catch (error) {
      console.error('Failed to add todo:', error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/todos/${id}`, {
        headers: {
          Authorization: getAuthToken(),
        },
      });
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error.message);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.title} - {todo.description}
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Add Todo</h2>
      <form>
        <label>Title:</label>
        <input type="text" name="title" value={newTodo.title} onChange={handleInputChange} />

        <label>Description:</label>
        <input type="text" name="description" value={newTodo.description} onChange={handleInputChange} />

        <button type="button" onClick={handleAddTodo}>
          Add Todo
        </button>
      </form>
    </div>
  );
};

export default TodoList;
