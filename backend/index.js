// index.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const connectionString = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 3000;
const secretKey = process.env.ACCESS_TOKEN_SECRET;
// Connect to MongoDB (replace 'your_database_url' with your MongoDB connection string)
mongoose.connect(connectionString);

// Middleware to parse JSON requests
app.use(express.json());

//end points
const User = require('./models/User');

// User Registration

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and verify the password
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Todo endpoints

const Todo = require('./models/Todo');

// Middleware to authenticate requests
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decodedToken.userId;
    next();
  });
};

// Create Todo
app.post('/todos', authenticateUser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = req.userId;

    const todo = new Todo({ user, title, description });
    await todo.save();

    res.status(201).json({ message: 'Todo created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read Todos
app.get('/todos', authenticateUser, async (req, res) => {
  try {
    const user = req.userId;
    const todos = await Todo.find({ user });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Todo
app.put('/todos/:id', authenticateUser, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const todoId = req.params.id;

    await Todo.findByIdAndUpdate(todoId, { title, description, status });

    res.json({ message: 'Todo updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Todo
app.delete('/todos/:id', authenticateUser, async (req, res) => {
  try {
    const todoId = req.params.id;

    await Todo.findByIdAndDelete(todoId);

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
