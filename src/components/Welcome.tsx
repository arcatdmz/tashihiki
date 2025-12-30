import ConfigPanel from './ConfigPanel'
import './Welcome.css'

interface WelcomeProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | 'custom') => void
  operatorMode: 'both' | 'plus' | 'minus'
  setOperatorMode: (mode: 'both' | 'plus' | 'minus') => void
  showTimer: boolean
  setShowTimer: (show: boolean) => void
  customRange: { min: number; max: number }
  setCustomRange: (range: { min: number; max: number }) => void
  onStart: () => void
}

function Welcome({
  difficulty,
  setDifficulty,
  operatorMode,
  setOperatorMode,
  showTimer,
  setShowTimer,
  customRange,
  setCustomRange,
  onStart,
}: WelcomeProps) {
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
        </div>
      </div>
      <button className="start-button" onClick={onStart}>
        🚀 はじめる
      </button>
    </div>
  )
}

export default Welcome
