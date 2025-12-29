import { useState, useEffect, useCallback } from 'react'
import styles from './QuizScreen.module.css'

interface Problem {
  num1: number
  num2: number
  operator: '+' | '-'
  answer: number
}

interface QuizScreenProps {
  onCorrect: (time: number) => void
  onWrong: (time: number) => void
  onFinish: () => void
  difficulty: 'easy' | 'medium' | 'hard' | 'custom'
  customRange: { min: number; max: number }
  showStartDimmer: boolean
  onDimmerStart: () => void
  startTime: number | null
  setStartTime: (t: number) => void
  elapsedTime: number
  setElapsedTime: (t: number) => void
  onDimmerChange?: (show: boolean) => void
}

function QuizScreen({
  onCorrect,
  onWrong,
  onFinish,
  difficulty,
  customRange,
  showStartDimmer,
  onDimmerStart,
  startTime,
  setStartTime,
  elapsedTime,
  setElapsedTime,
  onDimmerChange
}: QuizScreenProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
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
    // Only start timer if not showing start dimmer
    if (!showStartDimmer) {
      setStartTime(Date.now())
    }
  }, [difficulty, customRange, generateProblem, showStartDimmer])


  // showDimmerの変更を親に通知（AppのisFeedbackDimmer管理用）
  useEffect(() => {
    if (onDimmerChange) {
      onDimmerChange(showDimmer)
    }
  }, [showDimmer, onDimmerChange])

  // Start timer when dimmer is dismissed
  const handleStartClick = () => {
    onDimmerStart()
    setStartTime(Date.now())
    setElapsedTime(0)
  }

  // 答えを確認
  const checkAnswer = () => {
    if (userAnswer === '') return

    const isCorrect = parseInt(userAnswer) === problem.answer
  const responseTime = startTime ? Date.now() - startTime : 0

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
      onWrong(responseTime)
      setTimeout(() => {
        setShowDimmer(false)
        setFeedback('')
        nextProblem()
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
      <div className={styles['quiz-screen']}>
        <div className={styles['problem']}>
          <div className={styles['problem-inner']}>
            {showStartDimmer ? (
              <>
                <span className={styles['number']}>?</span>
                <span className={styles['operator']}>+</span>
                <span className={styles['number']}>?</span>
                <span className={styles['equals']}>=</span>
                <span className={styles['answer-box']}>?</span>
              </>
            ) : (
              <>
                <span className={styles['number']}>{problem.num1}</span>
                <span className={styles['operator']}>{problem.operator}</span>
                <span className={styles['number']}>{problem.num2}</span>
                <span className={styles['equals']}>=</span>
                <span className={styles['answer-box']}>{userAnswer || '?'}</span>
              </>
            )}
          </div>
        </div>
        <div className={styles['number-pad']}>
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} className={styles['number-button']} onClick={() => handleNumberClick(num)}>{num}</button>
          ))}
          <button className={[styles['number-button'], styles['clear']].join(' ')} onClick={handleClear}>クリア</button>
          <button className={styles['number-button']} onClick={() => handleNumberClick(0)}>0</button>
          <button className={[styles['number-button'], styles['delete']].join(' ')} onClick={handleDelete}>← けす</button>
        </div>
        <button className={styles['check-button']} onClick={checkAnswer}>✓ こたえる</button>
        <button className={styles['finish-button']} onClick={onFinish}>⏹️ おわる</button>
      </div>
      {showDimmer && (
        <div className={styles['feedback-dimmer']}>
          <div className={[
            styles['feedback-overlay'],
            feedback.includes('🎉') ? styles['correct'] : styles['wrong']
          ].join(' ')}>
            {(() => {
              const emojiRegex = /^([\uD800-\uDBFF][\uDC00-\uDFFF])/;
              const match = feedback.match(emojiRegex);
              if (match) {
                const emoji = match[0];
                const message = feedback.replace(emoji, '').trim();
                return <><div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '0.5rem' }}>{emoji}</div><div style={{ fontSize: '1.5rem', textAlign: 'left', whiteSpace: 'pre-line' }}>{message}</div></>;
              } else {
                return <div style={{ fontSize: '1.5rem', textAlign: 'left', whiteSpace: 'pre-line' }}>{feedback}</div>;
              }
            })()}
          </div>
        </div>
      )}
      {showStartDimmer && (
        <div className={styles['start-dimmer']}>
          <button className={styles['start-dimmer-button']} onClick={handleStartClick}>🚀 はじめる</button>
        </div>
      )}
    </>
  )
}

export default QuizScreen
