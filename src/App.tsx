import { useEffect, useState } from 'react'
import './App.css'

import QuizScreen from './components/QuizScreen'
import Results from './components/Results'
import Settings from './components/Settings'
import Welcome from './components/Welcome'

type ResponseTime = { time: number }

function App() {
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'settings' | 'results'>('welcome')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'custom'>('easy')
  const [showTimer, setShowTimer] = useState(true)
  const [customRange, setCustomRange] = useState({ min: 1, max: 10 })
  const [responseTimes, setResponseTimes] = useState<ResponseTime[]>([])
  const [showStartDimmer, setShowStartDimmer] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isFeedbackDimmer, setIsFeedbackDimmer] = useState(false)
  // タイマーintervalをAppで管理（dimmer中は止める）
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (screen === 'quiz' && !showStartDimmer && !isFeedbackDimmer && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [screen, showStartDimmer, isFeedbackDimmer, startTime])

  // URLクエリパラメータから初期状態を取得
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search)
    const timesParam = params.get('times')
    const times: ResponseTime[] = timesParam 
      ? timesParam.split(',').map(t => ({ time: parseFloat(t) }))
      : []
    
    return {
      correct: parseInt(params.get('correct') || '0') || 0,
      wrong: parseInt(params.get('wrong') || '0') || 0,
      times
    }
  }

  const [correctCount, setCorrectCount] = useState(() => getInitialState().correct)
  const [wrongCount, setWrongCount] = useState(() => getInitialState().wrong)

  // 初回起動チェック
  useEffect(() => {
    const started = localStorage.getItem('hasStarted')
    const initialState = getInitialState()
    
    // Load response times from URL
    if (initialState.times.length > 0) {
      setResponseTimes(initialState.times)
    }
    
    // If has progress in URL, show start dimmer instead of auto-starting
    if (started === 'true') {
      if (initialState.correct > 0 || initialState.wrong > 0) {
        setScreen('quiz')
        setShowStartDimmer(true)
      } else {
        setScreen('quiz')
      }
    }
  }, [])

  // 状態が変わったらURLを更新
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('correct', correctCount.toString())
    params.set('wrong', wrongCount.toString())
    
    // Save response times to URL
    if (responseTimes.length > 0) {
      params.set('times', responseTimes.map(rt => rt.time.toString()).join(','))
    }
    
    window.history.replaceState({}, '', `?${params.toString()}`)
  }, [correctCount, wrongCount, responseTimes])

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
    setShowStartDimmer(false)
  }

  const handleDimmerStart = () => {
    setShowStartDimmer(false)
  }

  const handleBackFromSettings = () => {
    setScreen('quiz')
    setShowStartDimmer(true)
  }

  return (
    <div className="app">
      <header className="app-header" onClick={() => setScreen('settings')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="app-title" style={{ margin: 0 }}>
            🧮 たしひき
          </h1>
        {showTimer && screen === 'quiz' && (
          <div className="timer-in-header" style={{ fontSize: '1.2rem', color: '#667eea', fontWeight: 'bold', background: 'white', padding: '0.4rem 1rem', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
            ⏱️ {elapsedTime}びょう
          </div>
        )}
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
            customRange={customRange}
            showStartDimmer={showStartDimmer}
            onDimmerStart={handleDimmerStart}
            startTime={startTime}
            setStartTime={setStartTime}
            elapsedTime={elapsedTime}
            setElapsedTime={setElapsedTime}
            onDimmerChange={setIsFeedbackDimmer}
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
            onBack={handleBackFromSettings}
          />
        )}
        {screen === 'results' && (
          <Results 
            correctCount={correctCount}
            wrongCount={wrongCount}
            responseTimes={responseTimes}
            onReset={handleReset}
            onBack={() => { setScreen('quiz'); setShowStartDimmer(true); }}
          />
        )}
      </main>
    </div>
  )
}

export default App
