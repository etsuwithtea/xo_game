import type { Translations } from '../types/language'

export const th: Translations = {
  title: 'เกม XO',
  navbar: {
    '3x3': '3x3',
    '4x4': '4x4',
    '5x5': '5x5'
  },
  scoreboard: {
    playerX: 'ผู้เล่น X',
    playerO: 'ผู้เล่น O',
    draws: 'เสมอ'
  },
  gameStatus: {
    playerTurn: 'ตาของผู้เล่น {player}',
    playerWins: 'ผู้เล่น {player} ชนะ! 🎉',
    draw: 'เสมอกัน! 🤝'
  },
  controls: {
    newGame: 'เกมใหม่',
    resetScores: 'รีเซ็ตคะแนน'
  },
  language: {
    english: 'English',
    thai: 'ไทย'
  }
}
