import { useMemo, useState } from 'react';

type Player = 'X' | 'O';
type Cell = Player | null;

type WinnerResult = {
  winner: Player;
  line: number[];
} | null;

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 6, 7],
  [2, 4, 6],
] satisfies number[][];

function createBoard(): Cell[] {
  return Array<Cell>(9).fill(null);
}

function getWinner(board: Cell[]): WinnerResult {
  for (const line of winningLines) {
    const [a, b, c] = line;
    const value = board[a];
    if (value && value === board[b] && value === board[c]) {
      return { winner: value, line };
    }
  }
  return null;
}

function isDraw(board: Cell[], winner: WinnerResult): boolean {
  return !winner && board.every(Boolean);
}

function getStatus(winner: WinnerResult, draw: boolean, currentPlayer: Player): string {
  if (winner) {
    return `${winner.winner} wins the match`;
  }
  if (draw) {
    return 'Round ends in a draw';
  }
  return `${currentPlayer}'s turn`;
}

export default function App() {
  const [board, setBoard] = useState<Cell[]>(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => isDraw(board, winner), [board, winner]);
  const status = getStatus(winner, draw, currentPlayer);

  function handleCellClick(index: number) {
    if (board[index] || winner || draw) {
      return;
    }

    const nextBoard = board.slice();
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    setCurrentPlayer((player) => (player === 'X' ? 'O' : 'X'));
  }

  function handleReset() {
    setBoard(createBoard());
    setCurrentPlayer('X');
  }

  const availableMoves = board.filter((cell) => cell === null).length;

  return (
    <main className="game-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="game-layout" aria-labelledby="game-title">
        <div className="hero-panel glass-panel">
          <div className="hero-header">
            <div>
              <p className="eyebrow">Web Game Preview</p>
              <h1 id="game-title">Tic Tac Toe</h1>
              <p className="hero-copy">A polished, responsive game board with clean turn handling, locked end states, and instant replay.</p>
            </div>
            <div className="turn-badge">
              <span>Current Turn</span>
              <strong>{currentPlayer}</strong>
            </div>
          </div>

          <div className="status-row">
            <div className={`status-pill ${winner ? 'status-win' : draw ? 'status-draw' : ''}`}>
              <span>Status</span>
              <strong>{status}</strong>
            </div>
            <button className="restart-button" type="button" onClick={handleReset}>
              Restart Game
            </button>
          </div>

          <div className="board-panel">
            <div className="board-meta">
              <div>
                <p className="meta-label">Remaining Moves</p>
                <strong>{availableMoves}</strong>
              </div>
              <div>
                <p className="meta-label">Match State</p>
                <strong>{winner ? 'Complete' : draw ? 'Draw' : 'Active'}</strong>
              </div>
            </div>

            <div className="board-grid" role="grid" aria-label="Tic Tac Toe board">
              {board.map((cell, index) => {
                const isWinningCell = Boolean(winner?.line.includes(index));
                return (
                  <button
                    key={index}
                    type="button"
                    className={`cell ${cell ? 'cell-filled' : ''} ${isWinningCell ? 'cell-win' : ''}`}
                    onClick={() => handleCellClick(index)}
                    disabled={Boolean(cell) || Boolean(winner) || draw}
                    aria-label={`Cell ${index + 1}${cell ? `, occupied by ${cell}` : ''}`}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="sidebar-panel glass-panel">
          <div>
            <p className="eyebrow">Match Control</p>
            <h2>Game Setup</h2>
          </div>

          <div className="info-list">
            <div className="info-item">
              <span>Starting Player</span>
              <strong>X</strong>
            </div>
            <div className="info-item">
              <span>Board Size</span>
              <strong>3 × 3</strong>
            </div>
            <div className="info-item">
              <span>Turn Switching</span>
              <strong>Automatic</strong>
            </div>
          </div>

          <div className="summary-card">
            <p>Rules</p>
            <ul>
              <li>Occupied cells cannot be played again.</li>
              <li>Winning lines lock the board immediately.</li>
              <li>Restart resets the board and the first turn.</li>
            </ul>
          </div>

          <div className="chip-row">
            <div className="chip">
              <span>X</span>
              <strong>Balanced</strong>
            </div>
            <div className="chip">
              <span>O</span>
              <strong>Responsive</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
