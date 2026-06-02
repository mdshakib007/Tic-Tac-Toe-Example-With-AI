const boardElement = document.querySelector('[data-board]');
const restartButton = document.querySelector('[data-restart]');
const turnLabel = document.querySelector('[data-turn-label]');
const winnerBanner = document.querySelector('[data-winner-banner]');
const gameCard = document.querySelector('.game-card');

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const state = {
  board: Array(9).fill(null),
  activePlayer: 'X',
  status: 'playing',
  winner: null,
  winningLine: [],
};

function evaluateWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  return null;
}

function buildBoard() {
  boardElement.innerHTML = '';

  state.board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Square ${index + 1}`);
    cell.dataset.index = String(index);
    cell.textContent = value ?? '';
    if (value) {
      cell.classList.add(value.toLowerCase());
    }
    boardElement.appendChild(cell);
  });
}

function render() {
  const cells = boardElement.querySelectorAll('.cell');

  cells.forEach((cell, index) => {
    const value = state.board[index];
    cell.textContent = value ?? '';
    cell.classList.toggle('x', value === 'X');
    cell.classList.toggle('o', value === 'O');
    cell.classList.toggle('win', state.winningLine.includes(index));
    cell.disabled = state.status !== 'playing' || Boolean(value);
  });

  turnLabel.textContent = state.status === 'playing' ? (state.activePlayer === 'X' ? 'User' : 'Computer') : '—';
  winnerBanner.textContent = state.status === 'won'
    ? `${state.winner === 'X' ? 'User' : 'Computer'} won the game`
    : state.status === 'draw'
      ? 'Game ended in a draw'
      : '';

  gameCard.classList.toggle('won', state.status === 'won');
  gameCard.classList.toggle('draw', state.status === 'draw');
  gameCard.classList.toggle('playing', state.status === 'playing');
}

function resetGame() {
  state.board = Array(9).fill(null);
  state.activePlayer = 'X';
  state.status = 'playing';
  state.winner = null;
  state.winningLine = [];
  buildBoard();
  render();
}

function finishGame(result) {
  state.status = result.winner ? 'won' : 'draw';
  state.winner = result.winner;
  state.winningLine = result.line;
  render();
}

function handleMove(index) {
  if (state.status !== 'playing' || state.board[index]) {
    return;
  }

  state.board[index] = state.activePlayer;
  const winningResult = evaluateWinner(state.board);

  if (winningResult) {
    finishGame(winningResult);
    return;
  }

  if (state.board.every(Boolean)) {
    finishGame({ winner: null, line: [] });
    return;
  }

  state.activePlayer = state.activePlayer === 'X' ? 'O' : 'X';
  render();
}

boardElement.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (!cell) {
    return;
  }

  handleMove(Number(cell.dataset.index));
});

restartButton.addEventListener('click', resetGame);

resetGame();
