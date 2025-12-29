import { useState, useEffect } from 'react'
import './App.css'
import QuizScreen from './components/QuizScreen.tsx'
import Settings from './components/Settings.tsx'
import Results from './components/Results.tsx'

interface ResponseTime {
  time: number
}

function App() {
  const [screen, setScreen] = useState<'quiz' | 'settings' | 'results'>('quiz')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'custom'>('easy')
  const [showTimer, setShowTimer] = useState(true)
  const [customRange, setCustomRange] = useState({ min: 1, max: 10 })
  const [responseTimes, setResponseTimes] = useState<ResponseTime[]>([])

  // URLクエリパラメータから初期状態を取得
  const getInitialCounts = () => {
    const params = new URLSearchParams(window.location.search)
    return {
      correct: parseInt(params.get('correct') || '0') || 0,
      wrong: parseInt(params.get('wrong') || '0') || 0
    }
  }

  const [correctCount, setCorrectCount] = useState(() => getInitialCounts().correct)
  const [wrongCount, setWrongCount] = useState(() => getInitialCounts().wrong)

  // 状態が変わったらURLを更新
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('correct', correctCount.toString())
    params.set('wrong', wrongCount.toString())
    window.history.replaceState({}, '', `?${params.toString()}`)
  }, [correctCount, wrongCount])

  const handleCorrectAnswer = (time: number) => {
    setCorrectCount(prev => prev + 1)
    setResponseTimes(prev => [...prev, { time }])
  }

  const handleWrongAnswer = () => {
    setWrongCount(prev => prev + 1)
  }

  const handleReset = () => {
    setCorrectCount(0)
    setWrongCount(0)
    setResponseTimes([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧮 たしひき</h1>
      </header>

      <main className="app-main">
        {screen === 'quiz' && (
          <QuizScreen 
            onCorrect={handleCorrectAnswer}
            onWrong={handleWrongAnswer}
            difficulty={difficulty}
            showTimer={showTimer}
            customRange={customRange}
          />
        )}
        {screen === 'settings' && (
          <Settings 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            showTimer={showTimer}
            setShowTimer={setShowTimer}
            customRange={customRange}
            setCustomRange={setCustomRange}
          />
        )}
        {screen === 'results' && (
          <Results 
            correctCount={correctCount}
            wrongCount={wrongCount}
            responseTimes={responseTimes}
            onReset={handleReset}
          />
        )}
      </main>

      <nav className="nav-buttons">
        <button 
          className={screen === 'quiz' ? 'active' : ''}
          onClick={() => setScreen('quiz')}
        >
          もんだい
        </button>
        <button 
          className={screen === 'settings' ? 'active' : ''}
          onClick={() => setScreen('settings')}
        >
          せってい
        </button>
        <button 
          className={screen === 'results' ? 'active' : ''}
          onClick={() => setScreen('results')}
        >
          けっか
        </button>
      </nav>
    </div>
  )
}

export default App
