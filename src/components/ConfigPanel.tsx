import React from 'react'
import styles from './Settings.module.css'

interface ConfigPanelProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'custom') => void
  operatorMode: 'both' | 'plus' | 'minus'
  setOperatorMode: (mode: 'both' | 'plus' | 'minus') => void
  showTimer: boolean
  setShowTimer: (show: boolean) => void
  customRange: { min: number; max: number }
  setCustomRange: (range: { min: number; max: number }) => void
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  difficulty,
  setDifficulty,
  operatorMode,
  setOperatorMode,
  showTimer,
  setShowTimer,
  customRange,
  setCustomRange,
}) => {
  // 入力欄の一時値をstateで管理
  const [minInput, setMinInput] = React.useState<string>(
    customRange.min.toString()
  )
  const [maxInput, setMaxInput] = React.useState<string>(
    customRange.max.toString()
  )

  // props変更時に同期
  React.useEffect(() => {
    setMinInput(customRange.min.toString())
    setMaxInput(customRange.max.toString())
  }, [customRange.min, customRange.max])

  // 入力変更
  const handleCustomMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value)
  }
  const handleCustomMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value)
  }

  // フォーカス外れ時にvalidate
  const validateMin = () => {
    let value = parseInt(minInput)
    if (isNaN(value) || value < 0) value = 0
    if (value > customRange.max) value = customRange.max
    setCustomRange({ ...customRange, min: value })
    setMinInput(value.toString())
  }
  const validateMax = () => {
    let value = parseInt(maxInput)
    if (isNaN(value) || value < customRange.min) value = customRange.min
    if (value > 100) value = 100
    setCustomRange({ ...customRange, max: value })
    setMaxInput(value.toString())
  }
  return (
    <>
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
      {difficulty === 'custom' && (
        <div className={`${styles['setting-group']} ${styles['custom-range']}`}>
          <h3>かずのはんい</h3>
          <div className={styles['range-inputs']}>
            <div className={styles['range-input']}>
              <label>いちばんちいさいかず</label>
              <input
                type="number"
                min="0"
                max={customRange.max}
                value={minInput}
                onChange={handleCustomMinChange}
                onBlur={validateMin}
              />
              <input
                type="range"
                min="0"
                max={customRange.max}
                value={customRange.min}
                onChange={(e) => {
                  setCustomRange({
                    ...customRange,
                    min: parseInt(e.target.value),
                  })
                }}
                style={{ width: '100%' }}
              />
            </div>
            <div className={styles['range-input']}>
              <label>いちばんおおきいかず</label>
              <input
                type="number"
                min={customRange.min}
                max="100"
                value={maxInput}
                onChange={handleCustomMaxChange}
                onBlur={validateMax}
              />
              <input
                type="range"
                min={customRange.min}
                max="100"
                value={customRange.max}
                onChange={(e) => {
                  setCustomRange({
                    ...customRange,
                    max: parseInt(e.target.value),
                  })
                }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles['setting-group']}>
        <h3>もんだいのしゅるい</h3>
        <div className={styles['difficulty-buttons']}>
          <button
            className={operatorMode === 'both' ? styles.active : ''}
            onClick={() => setOperatorMode('both')}
          >
            たしひき
          </button>
          <button
            className={operatorMode === 'plus' ? styles.active : ''}
            onClick={() => setOperatorMode('plus')}
          >
            たしざんだけ
          </button>
          <button
            className={operatorMode === 'minus' ? styles.active : ''}
            onClick={() => setOperatorMode('minus')}
          >
            ひきざんだけ
          </button>
        </div>
      </div>
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
    </>
  )
}

export default ConfigPanel
