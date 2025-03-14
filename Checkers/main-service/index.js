// main-service/index.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set everything in the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Redirect login.html
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.listen(PORT, () => {
  console.log(`Main service running on port ${PORT}`);
});
