const express = require('express');
const cors = require('cors'); // Use cors to get different ports
const app = express();
const PORT = 3002;

app.use(cors());

// Set game state
let currentGameState = null;

// Initialize/re-initialize the game state
function resetGame() {
  // Basic restart
  currentGameState = {
    message: "Game has been restarted at " + new Date().toISOString()
  };
}

// /restart -> resets the game
app.post('/restart', (req, res) => {
  resetGame();
  res.json({ status: 'ok', newState: currentGameState });
});

// /state -> returns the current game state
app.get('/state', (req, res) => {
  res.json({ currentGameState });
});

app.listen(PORT, () => {
  console.log(`restart-micro listening on port ${PORT}`);
  resetGame();
});
