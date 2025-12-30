import { useEffect, useMemo, useState } from 'react'
import './App.css'

import QuizScreen from './components/QuizScreen'
import Results from './components/Results'
import Settings from './components/Settings'
import Welcome from './components/Welcome'

function App() {
  const progressStorageKey = 'tashihiki-progress'
  const getInitialProgress = () => {
    const params = new URLSearchParams(window.location.search)
    const hasParams =
      params.has('correct') || params.has('wrong') || params.has('totalTime')
    if (hasParams) {
      const progress = {
        correct: parseInt(params.get('correct') || '0') || 0,
        wrong: parseInt(params.get('wrong') || '0') || 0,
        totalTime: parseFloat(params.get('totalTime') || '0') || 0,
      }
      localStorage.setItem(progressStorageKey, JSON.stringify(progress))
      window.history.replaceState({}, '', window.location.pathname)
      return { progress, fromShare: true }
    }

    const storedProgress = localStorage.getItem(progressStorageKey)
    if (storedProgress) {
      try {
        const parsed = JSON.parse(storedProgress) as {
          correct?: number
          wrong?: number
          totalTime?: number
        }
        return {
          progress: {
            correct: Number(parsed.correct) || 0,
            wrong: Number(parsed.wrong) || 0,
            totalTime: Number(parsed.totalTime) || 0,
          },
          fromShare: false,
        }
      } catch {
        localStorage.removeItem(progressStorageKey)
      }
    }

    return { progress: { correct: 0, wrong: 0, totalTime: 0 }, fromShare: false }
  }

  const initialProgress = useMemo(() => getInitialProgress(), [])
  const [screen, setScreen] = useState<
    'welcome' | 'quiz' | 'settings' | 'results'
  >('welcome')
  const [difficulty, setDifficulty] = useState<
    'easy' | 'medium' | 'hard' | 'custom'
  >('easy')
  const [operatorMode, setOperatorMode] = useState<'both' | 'plus' | 'minus'>(
    'both'
  )
  const [showTimer, setShowTimer] = useState(true)
  const [customRange, setCustomRange] = useState({ min: 1, max: 10 })
  const [showStartDimmer, setShowStartDimmer] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isFeedbackDimmer, setIsFeedbackDimmer] = useState(false)
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

  const [correctCount, setCorrectCount] = useState(
    initialProgress.progress.correct
  )
  const [wrongCount, setWrongCount] = useState(
    initialProgress.progress.wrong
  )
  const [totalAnswerTime, setTotalAnswerTime] = useState(
    initialProgress.progress.totalTime
  )

  useEffect(() => {
    const started = localStorage.getItem('hasStarted')

    if (initialProgress.fromShare) {
      setScreen('results')
    } else if (
      started === 'true' &&
      (initialProgress.progress.correct > 0 ||
        initialProgress.progress.wrong > 0)
    ) {
      setScreen('quiz')
      setShowStartDimmer(true)
    } else {
      setScreen('welcome')
    }
  }, [initialProgress])

  useEffect(() => {
    localStorage.setItem(
      progressStorageKey,
      JSON.stringify({
        correct: correctCount,
        wrong: wrongCount,
        totalTime: totalAnswerTime,
      })
    )
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
        className={`app-header ${screen === 'welcome' ? '' : 'app-header--clickable'}`}
        onClick={screen === 'welcome' ? undefined : () => setScreen('settings')}
      >
        <h1 className="app-title">🧮 たしひき</h1>
        {showTimer && screen === 'quiz' && (
          <div className="timer-in-header">⏱️ {elapsedTime}びょう</div>
        )}
      </header>

      <main className="app-main">
        {screen === 'welcome' && (
          <Welcome
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            operatorMode={operatorMode}
            setOperatorMode={setOperatorMode}
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
            shareUrl={`${window.location.origin}${window.location.pathname}?correct=${correctCount}&wrong=${wrongCount}&totalTime=${totalAnswerTime.toFixed(3)}`}
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
