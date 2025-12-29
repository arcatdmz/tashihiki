import React from 'react'
import './Welcome.css'

interface WelcomeProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'custom') => void
  showTimer: boolean
  setShowTimer: (show: boolean) => void
  customRange: { min: number; max: number }
  setCustomRange: (range: { min: number; max: number }) => void
  onStart: () => void
}

function Welcome({
  difficulty,
  setDifficulty,
  showTimer,
  setShowTimer,
  customRange,
  setCustomRange,
  onStart,
}: WelcomeProps) {
  const handleCustomMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setCustomRange({ ...customRange, min: value })
  }

  const handleCustomMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 10
    setCustomRange({ ...customRange, max: value })
  }

  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-intro">
          <h2>👋 ようこそ！</h2>
          <p>
            たしひきアプリへようこそ！
            <br />
            たしざんとひきざんのれんしゅうができるよ。
          </p>
        </div>

        <div className="welcome-settings">
          <h3>⚙️ せってい</h3>

          <div className="setting-group">
            <h4>むずかしさ</h4>
            <div className="difficulty-buttons">
              <button
                className={difficulty === 'easy' ? 'active' : ''}
                onClick={() => setDifficulty('easy')}
              >
                かんたん (1-10)
              </button>
              <button
                className={difficulty === 'medium' ? 'active' : ''}
                onClick={() => setDifficulty('medium')}
              >
                ふつう (1-20)
              </button>
              <button
                className={difficulty === 'hard' ? 'active' : ''}
                onClick={() => setDifficulty('hard')}
              >
                むずかしい (1-50)
              </button>
              <button
                className={difficulty === 'custom' ? 'active' : ''}
                onClick={() => setDifficulty('custom')}
              >
                じぶんできめる
              </button>
            </div>
          </div>

          {difficulty === 'custom' && (
            <div className="setting-group custom-range">
              <h4>かずのはんい</h4>
              <div className="range-inputs">
                <div className="range-input">
                  <label>さいしょう</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customRange.min}
                    onChange={handleCustomMinChange}
                  />
                </div>
                <div className="range-input">
                  <label>さいだい</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customRange.max}
                    onChange={handleCustomMaxChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="setting-group">
            <h4>タイマー</h4>
            <div className="timer-toggle">
              <button
                className={showTimer ? 'active' : ''}
                onClick={() => setShowTimer(true)}
              >
                ⏱️ ひょうじする
              </button>
              <button
                className={!showTimer ? 'active' : ''}
                onClick={() => setShowTimer(false)}
              >
                🙈 ひょうじしない
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="start-button" onClick={onStart}>
        🚀 はじめる
      </button>
    </div>
  )
}

export default Welcome
