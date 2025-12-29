import { useState, useEffect } from 'react'
import './App.css'
import QuizScreen from './components/QuizScreen'
import Settings from './components/Settings'
import Results from './components/Results'

function App() {
  const [screen, setScreen] = useState('quiz') // 'quiz', 'settings', 'results'
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [difficulty, setDifficulty] = useState('easy')
  const [showTimer, setShowTimer] = useState(true)
  const [customRange, setCustomRange] = useState({ min: 1, max: 10 })

  // URLクエリパラメータから状態を読み込む
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const correct = parseInt(params.get('correct')) || 0
    const wrong = parseInt(params.get('wrong')) || 0
    setCorrectCount(correct)
    setWrongCount(wrong)
  }, [])

  // 状態が変わったらURLを更新
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('correct', correctCount.toString())
    params.set('wrong', wrongCount.toString())
    window.history.replaceState({}, '', `?${params.toString()}`)
  }, [correctCount, wrongCount])

  const handleCorrectAnswer = () => {
    setCorrectCount(prev => prev + 1)
  }

  const handleWrongAnswer = () => {
    setWrongCount(prev => prev + 1)
  }

  const handleReset = () => {
    setCorrectCount(0)
    setWrongCount(0)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧮 足し算・引き算れんしゅう</h1>
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
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App
