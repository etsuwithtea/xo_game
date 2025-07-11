import { useState, useEffect, useMemo } from 'react'
import type { Language } from './types/language'
import { getTranslations, t } from './i18n'

type Player = 'X' | 'O' | ''
type Board = Player[][]
type GameMode = '3x3' | '4x4' | '5x5'

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [gameMode, setGameMode] = useState<GameMode>('3x3')
  const [player, setPlayer] = useState<'X' | 'O'>('X')
  const [board, setBoard] = useState<Board>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ])
  const [scores, setScores] = useState<{ X: number; O: number; draws: number }>({ X: 0, O: 0, draws: 0 })

  const translations = useMemo(() => getTranslations(language), [language])

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
    <div className={`min-h-screen bg-black text-white flex items-center justify-center p-5 ${language === 'th' ? 'font-thai' : 'font-sans'}`}>
      <div className="bg-black/95 rounded-2xl p-10 shadow-2xl backdrop-blur-md border-2 border-white/10 text-center max-w-2xl w-full">
        
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2 bg-gray-900/50 rounded-2xl p-2 border border-gray-700">
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                language === 'en' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white hover:bg-gray-800'
              }`}
              onClick={() => setLanguage('en')}
            >
              {translations.language.english}
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                language === 'th' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white hover:bg-gray-800'
              }`}
              onClick={() => setLanguage('th')}
            >
              {translations.language.thai}
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex justify-center gap-3 mb-8 bg-gray-900/50 rounded-2xl p-4 border border-gray-700">
          {(['3x3', '4x4', '5x5'] as GameMode[]).map((mode) => (
            <button 
              key={mode}
              className={`px-6 py-3 border-2 rounded-3xl font-semibold transition-all duration-300 uppercase tracking-wider min-w-20 ${
                gameMode === mode
                  ? 'bg-white text-black border-white shadow-lg transform -translate-y-0.5'
                  : 'border-gray-600 text-white hover:border-gray-400 hover:bg-gray-800 hover:transform hover:-translate-y-0.5'
              }`}
              onClick={() => changeGameMode(mode)}
            >
              {translations.navbar[mode]}
            </button>
          ))}
        </nav>

        <h1 className={`text-5xl font-bold text-white mb-8 drop-shadow-lg ${language === 'th' ? 'text-4xl' : ''}`}>
          {translations.title} {gameMode}
        </h1>
        
        {/* Scoreboard */}
        <div className="flex justify-between mb-8 bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col items-center gap-3">
            <span className="font-semibold text-base uppercase tracking-wide text-white">
              {translations.scoreboard.playerX}
            </span>
            <span className="text-3xl font-bold text-white">{scores.X}</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="font-semibold text-base uppercase tracking-wide text-gray-400">
              {translations.scoreboard.draws}
            </span>
            <span className="text-3xl font-bold text-white">{scores.draws}</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="font-semibold text-base uppercase tracking-wide text-white">
              {translations.scoreboard.playerO}
            </span>
            <span className="text-3xl font-bold text-white">{scores.O}</span>
          </div>
        </div>

        {/* Game Status */}
        <div className="mb-8 text-xl font-semibold min-h-10 flex items-center justify-center text-white">
          {gameOver ? (
            winner ? (
              <span className="text-white animate-celebrate">
                {t('gameStatus.playerWins', translations, { player: winner })}
              </span>
            ) : (
              <span className="text-gray-400 animate-celebrate">
                {translations.gameStatus.draw}
              </span>
            )
          ) : (
            <span className="text-white">
              {t('gameStatus.playerTurn', translations, { player })}
            </span>
          )}
        </div>

        {/* Game Board */}
        <div 
          className={`inline-grid gap-1 mb-8 p-4 bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-gray-700 ${
            getBoardSize() === 3 ? 'grid-cols-3' :
            getBoardSize() === 4 ? 'grid-cols-4' : 'grid-cols-5'
          }`}
        >
          {board.map((row, x) => 
            row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                className={`
                  ${getBoardSize() === 3 ? 'w-20 h-20 text-3xl' :
                    getBoardSize() === 4 ? 'w-16 h-16 text-2xl' : 'w-14 h-14 text-xl'
                  }
                  bg-gray-800 border-none rounded-lg font-bold cursor-pointer
                  transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                  shadow-lg flex items-center justify-center relative overflow-hidden
                  text-white border-2 border-gray-600
                  hover:transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-gray-700 hover:border-gray-500
                  active:transform active:translate-y-0 active:shadow-md
                  disabled:cursor-not-allowed
                  ${cell ? 'bg-gray-700 border-white animate-pop-in' : ''}
                `}
                onClick={() => makeMove(x, y)}
                disabled={gameOver || cell !== ''}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            className="px-6 py-3 border-none rounded-3xl text-base font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide min-w-36 relative overflow-hidden bg-white text-black shadow-lg font-bold hover:transform hover:-translate-y-0.5 hover:shadow-xl"
            onClick={resetGame}
          >
            {translations.controls.newGame}
          </button>
          <button 
            className="px-6 py-3 border-none rounded-3xl text-base font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide min-w-36 relative overflow-hidden bg-transparent text-white border-2 border-white/30 shadow-lg hover:transform hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/50 hover:shadow-xl"
            onClick={resetScores}
          >
            {translations.controls.resetScores}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
