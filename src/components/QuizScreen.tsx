import { useState, useEffect, useCallback } from 'react'
import './QuizScreen.css'

interface Problem {
  num1: number
  num2: number
  operator: '+' | '-'
  answer: number
}

interface QuizScreenProps {
  onCorrect: (time: number) => void
  onWrong: () => void
  onFinish: () => void
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  showTimer: boolean
  customRange: { min: number; max: number }
}

function QuizScreen({ onCorrect, onWrong, onFinish, difficulty, showTimer, customRange }: QuizScreenProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showDimmer, setShowDimmer] = useState(false)

  // 難易度に応じた範囲を取得
  const getRange = useCallback(() => {
    if (difficulty === 'custom') {
      return customRange
    }
    switch (difficulty) {
      case 'easy':
        return { min: 1, max: 10 }
      case 'medium':
        return { min: 1, max: 20 }
      case 'hard':
        return { min: 1, max: 50 }
      default:
        return { min: 1, max: 10 }
    }
  }, [difficulty, customRange])

  // 新しい問題を生成
  const generateProblem = useCallback((): Problem => {
    const range = getRange()
    const operator: '+' | '-' = Math.random() > 0.5 ? '+' : '-'
    
    let num1: number, num2: number
    if (operator === '+') {
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    } else {
      // 引き算の場合、答えが負にならないようにする
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
      num2 = Math.floor(Math.random() * num1) + 1
    }

    const answer = operator === '+' ? num1 + num2 : num1 - num2

    return { num1, num2, operator, answer }
  }, [getRange])

  const [problem, setProblem] = useState<Problem>(() => generateProblem())

  // 問題を初期化（難易度変更時）
  useEffect(() => {
    const newProblem = generateProblem()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProblem(newProblem)
    setStartTime(Date.now())
  }, [difficulty, customRange, generateProblem])

  // タイマー
  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  // 答えを確認
  const checkAnswer = () => {
    if (userAnswer === '') return

    const isCorrect = parseInt(userAnswer) === problem.answer
    const responseTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

    // Show dimmer with feedback
    setShowDimmer(true)

    if (isCorrect) {
      setFeedback('🎉 せいかい！')
      onCorrect(responseTime)
      setTimeout(() => {
        setShowDimmer(false)
        setFeedback('')
        nextProblem()
      }, 1500)
    } else {
      setFeedback(`😓 ざんねん！こたえは ${problem.answer} だよ`)
      onWrong()
      setTimeout(() => {
        setShowDimmer(false)
        setFeedback('')
        setUserAnswer('')
      }, 2000)
    }
  }

  // 次の問題へ
  const nextProblem = () => {
    setProblem(generateProblem())
    setUserAnswer('')
    setFeedback('')
    // Ensure fair timer start by setting time AFTER state updates
    setTimeout(() => {
      setStartTime(Date.now())
      setElapsedTime(0)
    }, 0)
  }

  // 数字ボタンクリック
  const handleNumberClick = (num: number) => {
    setUserAnswer(prev => prev + num.toString())
  }

  // 削除ボタン
  const handleDelete = () => {
    setUserAnswer(prev => prev.slice(0, -1))
  }

  // クリアボタン
  const handleClear = () => {
    setUserAnswer('')
  }

  return (
    <>
      <div className="quiz-screen">
        {showTimer && (
          <div className="timer-floating">
            ⏱️ {elapsedTime}びょう
          </div>
        )}

        <div className="problem">
          <span className="number">{problem.num1}</span>
          <span className="operator">{problem.operator}</span>
          <span className="number">{problem.num2}</span>
          <span className="equals">=</span>
          <span className="answer-box">{userAnswer || '?'}</span>
        </div>

        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className="number-button"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </button>
          ))}
          <button className="number-button clear" onClick={handleClear}>
            クリア
          </button>
          <button className="number-button" onClick={() => handleNumberClick(0)}>
            0
          </button>
          <button className="number-button delete" onClick={handleDelete}>
            ← けす
          </button>
        </div>

        <button className="check-button" onClick={checkAnswer}>
          ✓ こたえる
        </button>

        <button className="finish-button" onClick={onFinish}>
          ⏹️ おわる
        </button>
      </div>

      {showDimmer && (
        <div className="feedback-dimmer">
          <div className={`feedback-overlay ${feedback.includes('🎉') ? 'correct' : 'wrong'}`}>
            {feedback}
          </div>
        </div>
      )}
    </>
  )
}

export default QuizScreen
