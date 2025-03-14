const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3004;

app.use(cors());         // Use to call other ports
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'TejTej') {
    return res.json({
      status: 'ok',
      message: 'User authenticated successfully!',
      token: 'Valid'
    });
  } else {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
});

app.listen(PORT, () => {
  console.log(`login-micro listening on port ${PORT}`);
});
