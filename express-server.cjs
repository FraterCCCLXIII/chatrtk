const express = require('express');
const path = require('path');

const app = express();
const PORT = 12001;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the test.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});