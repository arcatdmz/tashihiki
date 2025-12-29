import { useState, useEffect, useCallback } from 'react'
import './QuizScreen.css'

function QuizScreen({ onCorrect, onWrong, difficulty, showTimer, customRange }) {
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

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
  const generateProblem = useCallback(() => {
    const range = getRange()
    const operator = Math.random() > 0.5 ? '+' : '-'
    
    let num1, num2
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

  const [problem, setProblem] = useState(() => generateProblem())

  // 問題を初期化（難易度変更時）
  useEffect(() => {
    const newProblem = generateProblem()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProblem(newProblem)
    setStartTime(Date.now())
  }, [difficulty, customRange, generateProblem])

  // タイマー
  useEffect(() => {
    if (!showTimer || !startTime) return

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [showTimer, startTime])

  // 答えを確認
  const checkAnswer = () => {
    if (userAnswer === '') return

    const isCorrect = parseInt(userAnswer) === problem.answer

    if (isCorrect) {
      setFeedback('🎉 せいかい！')
      onCorrect()
      setTimeout(() => {
        nextProblem()
      }, 1000)
    } else {
      setFeedback(`😓 ざんねん！こたえは ${problem.answer} だよ`)
      onWrong()
      setTimeout(() => {
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
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  // 数字ボタンクリック
  const handleNumberClick = (num) => {
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

  if (!problem) return <div>よみこみちゅう...</div>

  return (
    <div className="quiz-screen">
      {showTimer && (
        <div className="timer">
          ⏱️ {elapsedTime} びょう
        </div>
      )}

      <div className="problem">
        <span className="number">{problem.num1}</span>
        <span className="operator">{problem.operator}</span>
        <span className="number">{problem.num2}</span>
        <span className="equals">=</span>
        <span className="answer-box">{userAnswer || '?'}</span>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.includes('🎉') ? 'correct' : 'wrong'}`}>
          {feedback}
        </div>
      )}

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

      <button className="skip-button" onClick={nextProblem}>
        → つぎのもんだい
      </button>
    </div>
  )
}

export default QuizScreen
