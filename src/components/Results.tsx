import './Results.css'

interface ResponseTime {
  time: number
}

interface ResultsProps {
  correctCount: number
  wrongCount: number
  responseTimes: ResponseTime[]
  onReset: () => void
}

function Results({ correctCount, wrongCount, responseTimes, onReset }: ResultsProps) {
  const totalCount = correctCount + wrongCount
  const accuracy = totalCount > 0 
    ? Math.round((correctCount / totalCount) * 100) 
    : 0
  
  const averageTime = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((sum, rt) => sum + rt.time, 0) / responseTimes.length)
    : 0

  const getMessage = () => {
    if (totalCount === 0) {
      return "さあ、もんだいにチャレンジしよう！"
    }
    if (accuracy === 100) {
      return "パーフェクト！すばらしい！ 🎉"
    }
    if (accuracy >= 90) {
      return "すごい！パーフェクトに近いよ！ 🌟"
    }
    if (accuracy >= 70) {
      return "とてもよくできました！ 👏"
    }
    if (accuracy >= 50) {
      return "がんばったね！もっとれんしゅうしよう！ 💪"
    }
    return "あきらめないでれんしゅうをつづけよう！ 🌈"
  }

  return (
    <div className="results">
      <h2>📊 けっか</h2>

      <div className="stats-container">
        <div className="stat-card correct">
          <div className="stat-icon">🎉</div>
          <div className="stat-label">せいかい</div>
          <div className="stat-value">{correctCount}</div>
        </div>

        <div className="stat-card wrong">
          <div className="stat-icon">😓</div>
          <div className="stat-label">まちがい</div>
          <div className="stat-value">{wrongCount}</div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">📝</div>
          <div className="stat-label">ぜんぶ</div>
          <div className="stat-value">{totalCount}</div>
        </div>
      </div>

      {totalCount > 0 && (
        <>
          <div className="accuracy-section">
            <h3>せいかいりつ</h3>
            <div className="accuracy-bar">
              <div 
                className="accuracy-fill" 
                style={{ width: `${accuracy}%` }}
              >
                <span className="accuracy-text">{accuracy}%</span>
              </div>
            </div>
          </div>

          {responseTimes.length > 0 && (
            <div className="average-time-section">
              <h3>へいきんかいとうじかん</h3>
              <div className="average-time-value">
                ⏱️ {averageTime}びょう
              </div>
            </div>
          )}
        </>
      )}

      <div className="message-box">
        {getMessage()}
      </div>

      <button className="reset-button" onClick={onReset}>
        🔄 リセット
      </button>

      <div className="url-info">
        <p>💡 このページのURLをほぞんすると、けっかをあとでみることができるよ！</p>
        <div className="url-display">
          {window.location.href}
        </div>
      </div>
    </div>
  )
}

export default Results
