import { useState, useEffect, useMemo } from 'react'
import './App.css'

type Player = 'X' | 'O' | ''
type Board = Player[][]

function App() {
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [board, setBoard] = useState<Board>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
  const [scores, setScores] = useState<{ X: number; O: number; draws: number }>({ X: 0, O: 0, draws: 0 })

  // Basic algorithm from Vue.js version
  const calculateWinner = (board: Player[]) => {
    const lines = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
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
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ])
    setPlayer('X')
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Tic Tac Toe</h1>
        
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

        <div className="board">
          {board.map((row, x) => 
            row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                className={`cell ${cell ? cell.toLowerCase() : ''}`}
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
