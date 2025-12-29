import './Settings.css'

interface SettingsProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'custom') => void
  showTimer: boolean
  setShowTimer: (show: boolean) => void
  customRange: { min: number; max: number }
  setCustomRange: (range: { min: number; max: number }) => void
}

function Settings({ 
  difficulty, 
  setDifficulty, 
  showTimer, 
  setShowTimer,
  customRange,
  setCustomRange 
}: SettingsProps) {
  const handleCustomMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setCustomRange({ ...customRange, min: value })
  }

  const handleCustomMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 10
    setCustomRange({ ...customRange, max: value })
  }

  return (
    <div className="settings">
      <h2>⚙️ せってい</h2>

      <div className="setting-group">
        <h3>むずかしさ</h3>
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
          <h3>かずのはんい</h3>
          <div className="range-inputs">
            <div className="range-input">
              <label>いちばんちいさいかず</label>
              <input
                type="number"
                min="0"
                max="100"
                value={customRange.min}
                onChange={handleCustomMinChange}
              />
            </div>
            <div className="range-input">
              <label>いちばんおおきいかず</label>
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
        <h3>タイマー</h3>
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

      <div className="info-box">
        <p>💡 せつめい</p>
        <ul>
          <li>むずかしさをえらぶと、もんだいのかずがかわるよ</li>
          <li>タイマーをひょうじすると、じかんをきろくできるよ</li>
          <li>じぶんできめるをえらぶと、すきなかずのはんいにできるよ</li>
        </ul>
      </div>
    </div>
  )
}

export default Settings
