export type Language = 'en' | 'th'

export interface Translations {
  title: string
  navbar: {
    '3x3': string
    '4x4': string  
    '5x5': string
  }
  scoreboard: {
    playerX: string
    playerO: string
    draws: string
  }
  gameStatus: {
    playerTurn: string
    playerWins: string
    draw: string
  }
  controls: {
    newGame: string
    resetScores: string
  }
  language: {
    english: string
    thai: string
  }
}
