const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// In-memory user store (use DB or JSON for persistence)
let users = [];

// 🟢 User Register
app.post('/user/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).send({ message: 'User already exists' });
  }

  users.push({ name, email, password });
  res.status(201).send({ message: 'User registered successfully' });
});

// 🔵 User Update
app.put('/user/update/:email', (req, res) => {
  const email = req.params.email;
  const { name, password } = req.body;

  const index = users.findIndex(user => user.email === email);
  if (index === -1) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (name) users[index].name = name;
  if (password) users[index].password = password;

  res.send({ message: 'User updated successfully' });
});

// 🟠 Admin Get All Users
app.get('/admin/users', (req, res) => {
  res.send(users);
});

// 🔴 Admin Delete User
app.delete('/admin/delete/:email', (req, res) => {
  const email = req.params.email;
  const before = users.length;

  users = users.filter(user => user.email !== email);

  const deleted = before > users.length;
  res.send({ message: deleted ? 'User deleted successfully' : 'User not found' });
});

// ⚙️ Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
