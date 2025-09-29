import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Header({title}){
  return <h1>{title ? title : 'Default title'}</h1>;
}

function StartPage({ onStartGame }) {
  return (
    <div className="start-page">
      <div className="start-content">
        <Header title="Tic Tac Toe" className="game-title"></Header>
        <p className="game-description">
          Get three in a row to win!<br />
          X goes first, then O. Take turns clicking on empty squares.
        </p>
        <button className="start-button" onClick={onStartGame}>
          Start New Game
        </button>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const { winner, winningLine } = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square 
          value={squares[0]} 
          onSquareClick={() => handleClick(0)} 
          highlight={winningLine && winningLine.includes(0)}
        />
        <Square 
          value={squares[1]} 
          onSquareClick={() => handleClick(1)} 
          highlight={winningLine && winningLine.includes(1)}
        />
        <Square 
          value={squares[2]} 
          onSquareClick={() => handleClick(2)} 
          highlight={winningLine && winningLine.includes(2)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={squares[3]} 
          onSquareClick={() => handleClick(3)} 
          highlight={winningLine && winningLine.includes(3)}
        />
        <Square 
          value={squares[4]} 
          onSquareClick={() => handleClick(4)} 
          highlight={winningLine && winningLine.includes(4)}
        />
        <Square 
          value={squares[5]} 
          onSquareClick={() => handleClick(5)} 
          highlight={winningLine && winningLine.includes(5)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={squares[6]} 
          onSquareClick={() => handleClick(6)} 
          highlight={winningLine && winningLine.includes(6)}
        />
        <Square 
          value={squares[7]} 
          onSquareClick={() => handleClick(7)} 
          highlight={winningLine && winningLine.includes(7)}
        />
        <Square 
          value={squares[8]} 
          onSquareClick={() => handleClick(8)} 
          highlight={winningLine && winningLine.includes(8)}
        />
      </div>
    </>
  );
}

function Game({ onBackToStart }) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleNewGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    if (move === currentMove) {
      return (
        <li key={move}>
          <span>You are at move #{move}</span>
        </li>
      );
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <h1 className="game-header">
        <button className="back-button" onClick={onBackToStart}>
          ← Back to Start
        </button>
        <button className="new-game-button" onClick={handleNewGame}>
          New Game
        </button>
      </h1>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  function handleStartGame() {
    setGameStarted(true);
  }

  function handleBackToStart() {
    setGameStarted(false);
  }

  return (
    <div className="app">
      {gameStarted ? (
        <Game onBackToStart={handleBackToStart} />
      ) : (
        <StartPage onStartGame={handleStartGame} />
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return { winner: null, winningLine: null };
}