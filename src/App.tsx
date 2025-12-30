import { useEffect, useState } from 'react'
import './App.css'

import QuizScreen from './components/QuizScreen'
import Results from './components/Results'
import Settings from './components/Settings'
import Welcome from './components/Welcome'

function App() {
  const [screen, setScreen] = useState<
    'welcome' | 'quiz' | 'settings' | 'results'
  >('welcome')
  const [difficulty, setDifficulty] = useState<
    'easy' | 'medium' | 'hard' | 'custom'
  >('easy')
  const [operatorMode, setOperatorMode] = useState<'both' | 'plus' | 'minus'>('both')
  const [showTimer, setShowTimer] = useState(true)
  const [customRange, setCustomRange] = useState({ min: 1, max: 10 })
  const [showStartDimmer, setShowStartDimmer] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isFeedbackDimmer, setIsFeedbackDimmer] = useState(false)
  const [totalAnswerTime, setTotalAnswerTime] = useState(0)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (
      screen === 'quiz' &&
      !showStartDimmer &&
      !isFeedbackDimmer &&
      startTime
    ) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [screen, showStartDimmer, isFeedbackDimmer, startTime])

  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search)
    return {
      correct: parseInt(params.get('correct') || '0') || 0,
      wrong: parseInt(params.get('wrong') || '0') || 0,
      totalTime: parseFloat(params.get('totalTime') || '0') || 0,
    }
  }

  const [correctCount, setCorrectCount] = useState(
    () => getInitialState().correct
  )
  const [wrongCount, setWrongCount] = useState(() => getInitialState().wrong)
  useEffect(() => {
    const initialState = getInitialState()
    setTotalAnswerTime(initialState.totalTime)
  }, [])

  useEffect(() => {
    const started = localStorage.getItem('hasStarted')
    const initialState = getInitialState()

    if (
      started === 'true' &&
      (initialState.correct > 0 || initialState.wrong > 0)
    ) {
      setScreen('quiz')
      setShowStartDimmer(true)
    } else {
      setScreen('welcome')
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('correct', correctCount.toString())
    params.set('wrong', wrongCount.toString())
    params.set('totalTime', totalAnswerTime.toFixed(3))
    window.history.replaceState({}, '', `?${params.toString()}`)
  }, [correctCount, wrongCount, totalAnswerTime])

  const handleCorrectAnswer = (time: number) => {
    setCorrectCount((prev) => prev + 1)
    setTotalAnswerTime((prev) => prev + time / 1000)
  }

  const handleWrongAnswer = (time: number) => {
    setWrongCount((prev) => prev + 1)
    setTotalAnswerTime((prev) => prev + time / 1000)
  }

  const handleReset = () => {
    setCorrectCount(0)
    setWrongCount(0)
    setTotalAnswerTime(0)
  }

  const handleStart = () => {
    localStorage.setItem('hasStarted', 'true')
    window.scrollTo(0, 0)
    setScreen('quiz')
    setShowStartDimmer(false)
  }

  const handleDimmerStart = () => {
    setShowStartDimmer(false)
  }

  const handleBackFromSettings = () => {
    setScreen('quiz')
    setShowStartDimmer(true)
    setElapsedTime(0)
  }

  return (
    <div className="app">
      <header
        className="app-header"
        onClick={() => setScreen('settings')}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 className="app-title" style={{ margin: 0 }}>
          🧮 たしひき
        </h1>
        {showTimer && screen === 'quiz' && (
          <div
            className="timer-in-header"
            style={{
              fontSize: '1.2rem',
              color: '#667eea',
              fontWeight: 'bold',
              background: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            }}
          >
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
            operatorMode={operatorMode}
            showStartDimmer={showStartDimmer}
            onDimmerStart={handleDimmerStart}
            startTime={startTime}
            setStartTime={setStartTime}
            setElapsedTime={setElapsedTime}
            onDimmerChange={setIsFeedbackDimmer}
          />
        )}
        {screen === 'settings' && (
          <Settings
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            operatorMode={operatorMode}
            setOperatorMode={setOperatorMode}
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
            averageTime={
              correctCount + wrongCount > 0
                ? totalAnswerTime / (correctCount + wrongCount)
                : 0
            }
            onReset={handleReset}
            onBack={() => {
              setScreen('quiz')
              setShowStartDimmer(true)
              setElapsedTime(0)
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
