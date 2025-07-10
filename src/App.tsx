import { useState, useEffect, useMemo } from 'react'
import './App.css'

type Player = 'X' | 'O' | ''
type Board = Player[][]
type GameMode = '3x3' | '4x4' | '5x5'

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('3x3')
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [board, setBoard] = useState<Board>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
  const [scores, setScores] = useState<{ X: number; O: number; draws: number }>({ X: 0, O: 0, draws: 0 })

  // Get board size based on game mode
  const getBoardSize = () => {
    switch (gameMode) {
      case '3x3': return 3
      case '4x4': return 4
      case '5x5': return 5
      default: return 3
    }
  }

  // Create initial board based on size
  const createInitialBoard = (size: number): Board => {
    return Array(size).fill(null).map(() => Array(size).fill(''))
  }

  // Get winning combinations for different board sizes
  const getWinningLines = (size: number) => {
    const lines: number[][] = []
    
    // Rows
    for (let row = 0; row < size; row++) {
      const line = []
      for (let col = 0; col < size; col++) {
        line.push(row * size + col)
      }
      lines.push(line)
    }
    
    // Columns
    for (let col = 0; col < size; col++) {
      const line = []
      for (let row = 0; row < size; row++) {
        line.push(row * size + col)
      }
      lines.push(line)
    }
    
    // Main diagonal
    const mainDiagonal = []
    for (let i = 0; i < size; i++) {
      mainDiagonal.push(i * size + i)
    }
    lines.push(mainDiagonal)
    
    // Anti diagonal
    const antiDiagonal = []
    for (let i = 0; i < size; i++) {
      antiDiagonal.push(i * size + (size - 1 - i))
    }
    lines.push(antiDiagonal)
    
    return lines
  }

  // Enhanced algorithm for different board sizes
  const calculateWinner = (board: Player[]) => {
    const size = getBoardSize()
    const lines = getWinningLines(size)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const firstCell = board[line[0]]
      
      if (firstCell && line.every(index => board[index] === firstCell)) {
        return firstCell
      }
    }

    return null
  }

  const winner = useMemo(() => calculateWinner(board.flat()), [board])

  const checkDraw = (board: Board): boolean => {
    return board.flat().every(cell => cell !== '') && !winner
  }

  const gameOver = winner !== null || checkDraw(board)

  useEffect(() => {
    if (winner) {
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }))
    } else if (checkDraw(board)) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
    }
  }, [winner, board])

  // Basic move function from Vue.js version
  const makeMove = (x: number, y: number) => {
    if (winner) return
    if (board[x][y]) return

    const newBoard = board.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === x && colIndex === y ? player : cell
      )
    )

    setBoard(newBoard)
    setPlayer(player === 'X' ? 'O' : 'X')
  }

  // Basic reset function from Vue.js version
  const resetGame = () => {
    const size = getBoardSize()
    setBoard(createInitialBoard(size))
    setPlayer('X')
  }

  // Change game mode
  const changeGameMode = (mode: GameMode) => {
    setGameMode(mode)
    const size = mode === '3x3' ? 3 : mode === '4x4' ? 4 : 5
    setBoard(createInitialBoard(size))
    setPlayer('X')
  }

  // Initialize board when game mode changes
  useEffect(() => {
    const size = getBoardSize()
    setBoard(createInitialBoard(size))
    setPlayer('X')
  }, [gameMode])

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
  }

  return (
    <div className="app">
      <div className="container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <button 
            className={`nav-btn ${gameMode === '3x3' ? 'active' : ''}`}
            onClick={() => changeGameMode('3x3')}
          >
            3x3
          </button>
          <button 
            className={`nav-btn ${gameMode === '4x4' ? 'active' : ''}`}
            onClick={() => changeGameMode('4x4')}
          >
            4x4
          </button>
          <button 
            className={`nav-btn ${gameMode === '5x5' ? 'active' : ''}`}
            onClick={() => changeGameMode('5x5')}
          >
            5x5
          </button>
        </nav>

        <h1 className="title">Tic Tac Toe {gameMode}</h1>
        
        <div className="scoreboard">
          <div className="score-item">
            <span className="player-x">Player X</span>
            <span className="score">{scores.X}</span>
          </div>
          <div className="score-item">
            <span className="draws">Draws</span>
            <span className="score">{scores.draws}</span>
          </div>
          <div className="score-item">
            <span className="player-o">Player O</span>
            <span className="score">{scores.O}</span>
          </div>
        </div>

        <div className="game-status">
          {gameOver ? (
            winner ? (
              <span className={`winner ${winner.toLowerCase()}`}>
                Player {winner} Wins! 🎉
              </span>
            ) : (
              <span className="draw">It's a Draw! 🤝</span>
            )
          ) : (
            <span className={`current-player ${player.toLowerCase()}`}>
              Player {player}'s Turn
            </span>
          )}
        </div>

        <div className="board" data-size={getBoardSize()}>
          {board.map((row, x) => 
            row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                className={`cell ${cell ? cell.toLowerCase() : ''}`}
                data-size={getBoardSize()}
                onClick={() => makeMove(x, y)}
                disabled={gameOver || cell !== ''}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        <div className="controls">
          <button className="btn btn-primary" onClick={resetGame}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={resetScores}>
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
