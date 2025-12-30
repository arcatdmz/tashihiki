import styles from './Settings.module.css'

interface SettingsProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'custom') => void
  operatorMode: 'both' | 'plus' | 'minus'
  setOperatorMode: (mode: 'both' | 'plus' | 'minus') => void
  showTimer: boolean
  setShowTimer: (show: boolean) => void
  customRange: { min: number; max: number }
  setCustomRange: (range: { min: number; max: number }) => void
  onBack: () => void
}

function Settings({
  difficulty,
  setDifficulty,
  operatorMode,
  setOperatorMode,
  showTimer,
  setShowTimer,
  customRange,
  setCustomRange,
  onBack,
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
    <div className={styles.settings}>
      <h2>⚙️ せってい</h2>


      <div className={styles['setting-group']}>
        <h3>むずかしさ</h3>
        <div className={styles['difficulty-buttons']}>
          <button
            className={difficulty === 'easy' ? styles.active : ''}
            onClick={() => setDifficulty('easy')}
          >
            かんたん (1-10)
          </button>
          <button
            className={difficulty === 'medium' ? styles.active : ''}
            onClick={() => setDifficulty('medium')}
          >
            ふつう (1-20)
          </button>
          <button
            className={difficulty === 'hard' ? styles.active : ''}
            onClick={() => setDifficulty('hard')}
          >
            むずかしい (1-50)
          </button>
          <button
            className={difficulty === 'custom' ? styles.active : ''}
            onClick={() => setDifficulty('custom')}
          >
            じぶんできめる
          </button>
        </div>
      </div>

      <div className={styles['setting-group']}>
        <h3>もんだいのしゅるい</h3>
        <div className={styles['difficulty-buttons']}>
          <button
            className={operatorMode === 'both' ? styles.active : ''}
            onClick={() => setOperatorMode('both')}
          >
            足し算と引き算
          </button>
          <button
            className={operatorMode === 'plus' ? styles.active : ''}
            onClick={() => setOperatorMode('plus')}
          >
            足し算だけ
          </button>
          <button
            className={operatorMode === 'minus' ? styles.active : ''}
            onClick={() => setOperatorMode('minus')}
          >
            引き算だけ
          </button>
        </div>
      </div>

      {difficulty === 'custom' && (
        <div className={`${styles['setting-group']} ${styles['custom-range']}`}>
          <h3>かずのはんい</h3>
          <div className={styles['range-inputs']}>
            <div className={styles['range-input']}>
              <label>いちばんちいさいかず</label>
              <input
                type="number"
                min="0"
                max="100"
                value={customRange.min}
                onChange={handleCustomMinChange}
              />
            </div>
            <div className={styles['range-input']}>
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

      <div className={styles['setting-group']}>
        <h3>タイマー</h3>
        <div className={styles['timer-toggle']}>
          <button
            className={showTimer ? styles.active : ''}
            onClick={() => setShowTimer(true)}
          >
            ⏱️ ひょうじする
          </button>
          <button
            className={!showTimer ? styles.active : ''}
            onClick={() => setShowTimer(false)}
          >
            🙈 ひょうじしない
          </button>
        </div>
      </div>

      <div className={styles['info-box']}>
        <p>💡 せつめい</p>
        <ul>
          <li>むずかしさをえらぶと、もんだいのかずがかわるよ</li>
          <li>タイマーをひょうじすると、じかんをきろくできるよ</li>
          <li>じぶんできめるをえらぶと、すきなかずのはんいにできるよ</li>
        </ul>
      </div>

      <button className={styles['back-button']} onClick={onBack}>
        ← もどる
      </button>
    </div>
  )
}

export default Settings
