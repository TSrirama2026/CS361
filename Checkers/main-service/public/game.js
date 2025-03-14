/****************************************
  Basic Checkers Implementation:
  - White (user) always moves first
  - Black (simple AI) moves second
*****************************************/

const boardSize = 8; // 8x8 board
// We'll store pieces in a 2D array: each cell can be:
//  null         -> empty
//  { color: 'W' or 'B', king: true/false }
let board = [];

// Track whose turn it is: 'W' or 'B'
let currentTurn = 'W';

// For click-based moves:
let selectedPiece = null; // {row, col}
let possibleMoves = [];   // list of valid moves or captures for the selected piece
let statusEl;

window.addEventListener("DOMContentLoaded", init);

function init() {
  statusEl = document.getElementById("statusMessage");
  createBoardUI();
  initBoardData();
  renderBoard();
  updateStatus("White's turn (Your move).");
}

// Create the 8x8 squares in the DOM:
function createBoardUI() {
  const boardEl = document.getElementById("checkersBoard");
  // Clear if any pre-existing (not likely needed, but just in case)
  boardEl.innerHTML = "";

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      // Decide color of square
      if ((row + col) % 2 === 0) {
        square.classList.add("white");
      } else {
        square.classList.add("black");
      }
      // We'll store coords so we can retrieve them when clicked
      square.dataset.row = row;
      square.dataset.col = col;

      // Only attach click events for squares of the current user?
      square.addEventListener("click", onSquareClick);
      // Append to the board
      boardEl.appendChild(square);
    }
  }
}

// Initialize the board data with white pieces in bottom three rows, black in top three rows:
function initBoardData() {
  board = new Array(boardSize).fill(null).map(() => new Array(boardSize).fill(null));

  // Black pieces at rows 0..2
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < boardSize; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: "B", king: false };
      }
    }
  }
  // White pieces at rows 5..7
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < boardSize; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: "W", king: false };
      }
    }
  }
}

// Renders the board data onto the HTML squares
function renderBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const piece = board[row][col];
      const squareEl = getSquareEl(row, col);

      // Clear old content
      squareEl.innerHTML = "";

      if (piece) {
        const checker = document.createElement("div");
        checker.classList.add("checker");
        if (piece.color === "W") {
          checker.classList.add("white-piece");
        } else {
          checker.classList.add("black-piece");
        }
        if (piece.king) {
          checker.classList.add("king");
        }
        squareEl.appendChild(checker);
      }
    }
  }
}

function getSquareEl(row, col) {
  // each row has 8 squares, so index = row*8 + col
  const index = row * boardSize + col;
  return document.querySelectorAll(".square")[index];
}

// Handle square clicks:
function onSquareClick(e) {
  if (currentTurn !== 'W') {
    // It's AI's turn, ignore user clicks
    return;
  }
  const row = parseInt(e.currentTarget.dataset.row);
  const col = parseInt(e.currentTarget.dataset.col);

  // If no piece selected yet:
  if (!selectedPiece) {
    // Check if there's a White piece here
    const piece = board[row][col];
    if (piece && piece.color === "W") {
      // highlight possible moves
      selectedPiece = { row, col };
      possibleMoves = getValidMoves(row, col);
      highlightSquares(possibleMoves);
      highlightSquare(row, col, true);
    }
  } else {
    // We have selected a piece. Let's see if (row,col) is a valid move
    const valid = possibleMoves.find(m => m.r === row && m.c === col);
    if (valid) {
      // Make the move
      movePiece(selectedPiece.row, selectedPiece.col, row, col);

      // If that was a capture, check if we can keep capturing
      if (Math.abs(row - selectedPiece.row) === 2) {
        // capture
        const midRow = (selectedPiece.row + row) / 2;
        const midCol = (selectedPiece.col + col) / 2;
        // remove captured piece
        board[midRow][midCol] = null;

        // Now check if we can continue capturing from new position
        const newMoves = getValidMoves(row, col, /*forceCaptureOnly=*/true);
        if (newMoves.length > 0) {
          // allow multiple jumps
          selectedPiece = { row, col };
          possibleMoves = newMoves;
          renderBoard();
          highlightSquares(possibleMoves);
          highlightSquare(row, col, true);
          return; // do not end turn yet
        }
      }

      // End user turn, check for king promotion
      maybeKing(row, col);
      renderBoard();
      clearHighlights();
      selectedPiece = null;
      possibleMoves = [];

      // Check if black still has moves or pieces
      if (checkWinCondition()) {
        return;
      }

      // Now AI moves
      setTimeout(() => {
        aiMove();
      }, 500);
    } else {
      // clicked an invalid square or different piece
      clearHighlights();
      // see if we clicked on a different White piece
      const piece = board[row][col];
      if (piece && piece.color === "W") {
        selectedPiece = { row, col };
        possibleMoves = getValidMoves(row, col);
        highlightSquares(possibleMoves);
        highlightSquare(row, col, true);
      } else {
        selectedPiece = null;
        possibleMoves = [];
      }
    }
  }
}

// Basic function to get all valid moves or captures for a piece
// If forceCaptureOnly is true, only return capturing moves
function getValidMoves(row, col, forceCaptureOnly=false) {
  const piece = board[row][col];
  if (!piece) return [];

  const directions = [];
  if (piece.color === "W" || piece.king) {
    directions.push([-1, -1]);
    directions.push([-1, 1]);
  }
  if (piece.color === "B" || piece.king) {
    directions.push([1, -1]);
    directions.push([1, 1]);
  }

  let moves = [];
  // Check each direction for possible capture or simple move
  for (const [dr, dc] of directions) {
    const newR = row + dr;
    const newC = col + dc;
    // Simple move
    if (!forceCaptureOnly) {
      if (isOnBoard(newR, newC) && board[newR][newC] == null) {
        moves.push({ r: newR, c: newC });
      }
    }
    // Capture move
    const jumpR = row + 2 * dr;
    const jumpC = col + 2 * dc;
    if (isOnBoard(jumpR, jumpC) && board[jumpR][jumpC] == null) {
      const mid = board[row + dr][col + dc];
      if (mid && mid.color !== piece.color) {
        // can capture
        moves.push({ r: jumpR, c: jumpC });
      }
    }
  }

  // If any capture moves exist, we want to *only* return capture moves (enforce capturing rule)
  const captures = moves.filter(m => Math.abs(m.r - row) === 2);
  if (captures.length > 0) {
    return captures; 
  }
  // If we are forcing captures only, return only the captures
  if (forceCaptureOnly) {
    return captures;
  }
  return moves;
}

function isOnBoard(r, c) {
  return r >= 0 && r < boardSize && c >= 0 && c < boardSize;
}

function movePiece(fromR, fromC, toR, toC) {
  board[toR][toC] = board[fromR][fromC];
  board[fromR][fromC] = null;
}

function maybeKing(r, c) {
  const piece = board[r][c];
  if (!piece) return;
  if (piece.color === "W" && r === 0) {
    piece.king = true;
  } else if (piece.color === "B" && r === boardSize - 1) {
    piece.king = true;
  }
}

// AI logic (Black): 
// 1) Check for any capturing move among all black pieces; pick the first
// 2) If no capture, pick any simple move (again, the first it finds)
function aiMove() {
  currentTurn = 'B';
  updateStatus("Black is thinking...");

  // find all black pieces, see if any captures are possible
  let bestMove = null;
  let fromPos = null;

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const piece = board[r][c];
      if (piece && piece.color === "B") {
        const moves = getValidMoves(r, c);
        // prefer captures
        const capture = moves.find(m => Math.abs(m.r - r) === 2);
        if (capture) {
          bestMove = capture;
          fromPos = { r, c };
          break;
        } else if (!bestMove && moves.length > 0) {
          // store the first simple move we find
          bestMove = moves[0];
          fromPos = { r, c };
        }
      }
      if (bestMove && Math.abs(bestMove.r - r) === 2) break;
    }
  }

  if (!bestMove || !fromPos) {
    // no moves => white wins
    updateStatus("Black has no moves! White wins!");
    return;
  }

  // execute the best move
  movePiece(fromPos.r, fromPos.c, bestMove.r, bestMove.c);
  // check if it was a capture
  if (Math.abs(bestMove.r - fromPos.r) === 2) {
    const midRow = (fromPos.r + bestMove.r) / 2;
    const midCol = (fromPos.c + bestMove.c) / 2;
    board[midRow][midCol] = null;

    // possibly continue capturing
    let canContinue = true;
    let currentR = bestMove.r;
    let currentC = bestMove.c;
    // while a capture is possible, keep capturing
    while (canContinue) {
      let chain = getValidMoves(currentR, currentC, true); 
      const nextCap = chain.find(m => Math.abs(m.r - currentR) === 2);
      if (nextCap) {
        // do that capture
        movePiece(currentR, currentC, nextCap.r, nextCap.c);
        const midR = (currentR + nextCap.r) / 2;
        const midC = (currentC + nextCap.c) / 2;
        board[midR][midC] = null;
        currentR = nextCap.r;
        currentC = nextCap.c;
      } else {
        canContinue = false;
      }
    }
    maybeKing(currentR, currentC);
  } else {
    maybeKing(bestMove.r, bestMove.c);
  }

  renderBoard();

  if (checkWinCondition()) {
    return;
  }

  // Switch turn back to white
  currentTurn = 'W';
  updateStatus("White's turn (Your move).");
}

function checkWinCondition() {
  // see if White or Black has no pieces or no moves
  const whitePieces = [];
  const blackPieces = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const piece = board[r][c];
      if (piece) {
        if (piece.color === 'W') {
          whitePieces.push({r, c});
        } else {
          blackPieces.push({r, c});
        }
      }
    }
  }
  if (whitePieces.length === 0) {
    updateStatus("Black wins! White has no pieces left.");
    return true;
  } else if (blackPieces.length === 0) {
    updateStatus("White wins! Black has no pieces left.");
    return true;
  }

  // If it's White's turn, check if White has any moves
  if (currentTurn === 'W') {
    let hasMove = false;
    for (let w of whitePieces) {
      const moves = getValidMoves(w.r, w.c);
      if (moves.length > 0) {
        hasMove = true;
        break;
      }
    }
    if (!hasMove) {
      updateStatus("White has no moves! Black wins!");
      return true;
    }
  } else {
    // if it's black's turn, check if black has any moves
    let hasMove = false;
    for (let b of blackPieces) {
      const moves = getValidMoves(b.r, b.c);
      if (moves.length > 0) {
        hasMove = true;
        break;
      }
    }
    if (!hasMove) {
      updateStatus("Black has no moves! White wins!");
      return true;
    }
  }
  return false;
}

function updateStatus(msg) {
  if (statusEl) {
    statusEl.innerText = msg;
  }
}

// Utility to highlight squares for potential moves
function highlightSquares(moves) {
  moves.forEach(m => {
    const el = getSquareEl(m.r, m.c);
    el.classList.add("selected");
  });
}

function highlightSquare(r, c, on) {
  const el = getSquareEl(r, c);
  if (on) {
    el.classList.add("selected");
  } else {
    el.classList.remove("selected");
  }
}

// Clear all highlight classes
function clearHighlights() {
  document.querySelectorAll(".square").forEach(sq => {
    sq.classList.remove("selected");
  });
}
