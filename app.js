const boardElement = document.querySelector('[data-board]');
const restartButton = document.querySelector('[data-restart]');
const turnLabel = document.querySelector('[data-turn-label]');
const statusTitle = document.querySelector('[data-status-title]');
const statusMessage = document.querySelector('[data-status-message]');
const panelState = document.querySelector('[data-panel-state]');
const panelDetail = document.querySelector('[data-panel-detail]');
const summaryTurn = document.querySelector('[data-summary-turn]');
const summaryMoves = document.querySelector('[data-summary-moves]');
const summaryResult = document.querySelector('[data-summary-result]');
const statusChip = document.querySelector('[data-status-chip]');

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
  winner: null,
  winningLine: [],
  moves: 0,
  status: 'playing',
};

function createBoard() {
  boardElement.innerHTML = '';

  state.board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Square ${index + 1}`);
    cell.dataset.index = String(index);
    cell.textContent = value ?? '';
    if (value) cell.classList.add(value.toLowerCase());
    boardElement.appendChild(cell);
  });
}

function evaluateWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: [] };
}

function updateStatus() {
  turnLabel.textContent = state.activePlayer;
  summaryTurn.textContent = state.activePlayer;
  summaryMoves.textContent = String(state.moves);

  if (state.status === 'won') {
    const result = `${state.winner} wins`;
    statusTitle.textContent = `${state.winner} wins the match`;
    statusMessage.textContent = `Winning line: ${state.winningLine.map((index) => index + 1).join(', ')}`;
    panelState.textContent = 'Game complete';
    panelDetail.textContent = 'Winning cells stay highlighted until you restart the game.';
    summaryResult.textContent = result;
    statusChip.classList.add('is-ended');
    return;
  }

  if (state.status === 'draw') {
    statusTitle.textContent = 'Draw game';
    statusMessage.textContent = 'The board is full with no winning line.';
    panelState.textContent = 'Game complete';
    panelDetail.textContent = 'Restart to clear the board and begin a new match.';
    summaryResult.textContent = 'Draw';
    statusChip.classList.add('is-ended');
    return;
  }

  statusTitle.textContent = `Player ${state.activePlayer}’s move`;
  statusMessage.textContent = 'Click any empty square to continue the match.';
  panelState.textContent = 'Active play';
  panelDetail.textContent = 'Board updates are derived from the current state, so invalid moves are ignored automatically.';
  summaryResult.textContent = 'Playing';
  statusChip.classList.remove('is-ended');
}

function renderBoard() {
  const cells = boardElement.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const value = state.board[index];
    cell.textContent = value ?? '';
    cell.classList.toggle('x', value === 'X');
    cell.classList.toggle('o', value === 'O');
    cell.classList.toggle('win', state.winningLine.includes(index));
    cell.disabled = state.status !== 'playing' || Boolean(value);
    cell.setAttribute('aria-label', `Square ${index + 1}${value ? `, occupied by ${value}` : ''}`);
  });
}

function render() {
  createBoard();
  renderBoard();
  updateStatus();
}

function handleMove(index) {
  if (state.status !== 'playing' || state.board[index]) return;

  state.board[index] = state.activePlayer;
  state.moves += 1;

  const result = evaluateWinner(state.board);
  if (result.winner) {
    state.status = 'won';
    state.winner = result.winner;
    state.winningLine = result.line;
    render();
    return;
  }

  if (state.moves === 9) {
    state.status = 'draw';
    state.winner = null;
    state.winningLine = [];
    render();
    return;
  }

  state.activePlayer = state.activePlayer === 'X' ? 'O' : 'X';
  render();
}

function restartGame() {
  state.board = Array(9).fill(null);
  state.activePlayer = 'X';
  state.winner = null;
  state.winningLine = [];
  state.moves = 0;
  state.status = 'playing';
  render();
}

boardElement.addEventListener('click', (event) => {
  const button = event.target.closest('.cell');
  if (!button) return;
  handleMove(Number(button.dataset.index));
});

restartButton.addEventListener('click', restartGame);

render();
