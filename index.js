const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/tasks', (req, res) => {
  const { description } = req.body;
  const query = 'INSERT INTO tasks (description) VALUES (?)';
  connection.query(query, [description], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: `Task added with ID: ${results.insertId}` });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE tasks SET completed = true WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: `Task with ID: ${id} marked as completed` });
  });
});

app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: `Task with ID: ${id} deleted` });
  });
});

app.put('/tasks/edit/:id', (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const query = 'UPDATE tasks SET description = ? WHERE id = ?';
  connection.query(query, [description, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: `Task with ID: ${id} updated` });
  });
});

const dbConfig = {
  host      : '34.136.71.152',
  user      : 'root',
  password  : '>+h%sF=;g]7Qx+0j',
  database  : 'to-do',
  ssl: {
    ca: fs.readFileSync('server-ca.pem'),
    key: fs.readFileSync('client-key.pem'),
    cert: fs.readFileSync('client-cert.pem')
  }
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('Error connection: ' + err.stack);
    return;
  }
  console.log('Connected to database with SSL');
});

// Serve static files from the public directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Todo app listening at http://localhost:${port}`);
});
