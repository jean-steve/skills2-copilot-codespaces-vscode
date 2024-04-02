// Create web server
const express = require('express');
const app = express();
const port = 3000;

// Create data
const comments = [
  { name: 'John', comment: 'Hello!' },
  { name: 'Amy', comment: 'Hi!' },
  { name: 'Tina', comment: 'Hey!' }
];

// Set view engine
app.set('view engine', 'pug');

// Set route
app.get('/', (req, res) => {
  res.render('comments', { comments });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});