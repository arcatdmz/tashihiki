import styles from './Settings.module.css'
import ConfigPanel from './ConfigPanel'

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
  // ...existing code...


  return (
    <div className={styles.settings}>
      <h2>⚙️ せってい</h2>
      <ConfigPanel
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        operatorMode={operatorMode}
        setOperatorMode={setOperatorMode}
        showTimer={showTimer}
        setShowTimer={setShowTimer}
        customRange={customRange}
        setCustomRange={setCustomRange}
      />

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
