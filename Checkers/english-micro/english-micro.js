const express = require('express');
const cors = require('cors'); // Use to call other ports
const app = express();
const PORT = 3003;

app.use(cors());

// /language -> returns "English"
app.get('/language', (req, res) => {
  res.json({ language: "English" });
});

app.listen(PORT, () => {
  console.log(`english-micro listening on port ${PORT}`);
});
