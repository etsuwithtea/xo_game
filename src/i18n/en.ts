import type { Translations } from '../types/language'

export const en: Translations = {
  title: 'Tic Tac Toe',
  navbar: {
    '3x3': '3x3',
    '4x4': '4x4',
    '5x5': '5x5'
  },
  scoreboard: {
    playerX: 'Player X',
    playerO: 'Player O', 
    draws: 'Draws'
  },
  gameStatus: {
    playerTurn: 'Player {player}\'s Turn',
    playerWins: 'Player {player} Wins! 🎉',
    draw: 'It\'s a Draw! 🤝'
  },
  controls: {
    newGame: 'New Game',
    resetScores: 'Reset Scores'
  },
  language: {
    english: 'English',
    thai: 'ไทย'
  }
}
