import { useState, useEffect } from 'react'
import './App.css'
import QuizScreen from './components/QuizScreen.tsx'
import Settings from './components/Settings.tsx'
import Results from './components/Results.tsx'
import Welcome from './components/Welcome.tsx'

interface ResponseTime {
  time: number
}

function App() {
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'settings' | 'results'>('welcome')
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

  // 初回起動チェック
  useEffect(() => {
    const started = localStorage.getItem('hasStarted')
    if (started === 'true') {
      setScreen('quiz')
    }
  }, [])

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

  const handleStart = () => {
    localStorage.setItem('hasStarted', 'true')
    setScreen('quiz')
  }

  return (
    <div className="app">
      <header className="app-header" onClick={() => setScreen('settings')} style={{ cursor: 'pointer' }}>
        <h1>🧮 たしひき</h1>
      </header>

      <main className="app-main">
        {screen === 'welcome' && (
          <Welcome 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            showTimer={showTimer}
            setShowTimer={setShowTimer}
            customRange={customRange}
            setCustomRange={setCustomRange}
            onStart={handleStart}
          />
        )}
        {screen === 'quiz' && (
          <QuizScreen 
            onCorrect={handleCorrectAnswer}
            onWrong={handleWrongAnswer}
            onFinish={() => setScreen('results')}
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
            onBack={() => setScreen('quiz')}
          />
        )}
        {screen === 'results' && (
          <Results 
            correctCount={correctCount}
            wrongCount={wrongCount}
            responseTimes={responseTimes}
            onReset={handleReset}
            onBack={() => setScreen('quiz')}
          />
        )}
      </main>
    </div>
  )
}

export default App
