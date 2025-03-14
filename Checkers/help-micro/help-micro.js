const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

const helpText = `
  <h2>Rules</h2>
  <ol>
    <li>Both sides start with 12 pawns (checkers).</li>
    <li>Checkers move diagonally forward, unless promoted to King, which can move backward too.</li>
    <li>Players alternate turns after every move.</li>
    <li>If you can capture an opponent's piece, you MUST do so.</li>
    <li>You can keep capturing as long as more captures are possible.</li>
    <li>A player wins when the opponent has no pieces left or cannot move.</li>
  </ol>
  <h2>Page Help</h2>
  <ol>
    <li>Click the buttons at the top of the page to navigate to the pages</li>
    <li>Re-visit the help tab if you forget how to use a page</li>
    <li>You can view your account details on the accounts page</li>
    <li>You can play the game according to the rules above on the game page</li>
  </ol>
`;

// Return text of help page
app.get('/help', (req, res) => {
  res.send(helpText);
});

app.listen(PORT, () => {
  console.log(`help-micro listening on port ${PORT}`);
});
