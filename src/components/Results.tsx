import styles from './Results.module.css'

interface ResultsProps {
  correctCount: number
  wrongCount: number
  averageTime: number
  onReset: () => void
  onBack: () => void
}

function Results({
  correctCount,
  wrongCount,
  averageTime,
  onReset,
  onBack,
}: ResultsProps) {
  const totalCount = correctCount + wrongCount
  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  const getMessage = () => {
    if (totalCount === 0) {
      return 'さあ、もんだいにチャレンジしよう！'
    }
    if (accuracy === 100) {
      return 'パーフェクト！すばらしい！ 🎉'
    }
    if (accuracy >= 90) {
      return 'すごい！パーフェクトに近いよ！ 🌟'
    }
    if (accuracy >= 70) {
      return 'とてもよくできました！ 👏'
    }
    if (accuracy >= 50) {
      return 'がんばったね！もっとれんしゅうしよう！ 💪'
    }
    return 'あきらめないでれんしゅうをつづけよう！ 🌈'
  }

  return (
    <div className={styles.results}>
      <h2>📊 けっか</h2>

      <div className={styles['stats-container']}>
        <div className={styles['stat-card'] + ' ' + styles.correct}>
          <div className={styles['stat-icon']}>🎉</div>
          <div className={styles['stat-label']}>せいかい</div>
          <div className={styles['stat-value']}>{correctCount}</div>
        </div>

        <div className={styles['stat-card'] + ' ' + styles.wrong}>
          <div className={styles['stat-icon']}>😓</div>
          <div className={styles['stat-label']}>まちがい</div>
          <div className={styles['stat-value']}>{wrongCount}</div>
        </div>

        <div className={styles['stat-card'] + ' ' + styles.total}>
          <div className={styles['stat-icon']}>📝</div>
          <div className={styles['stat-label']}>ぜんぶ</div>
          <div className={styles['stat-value']}>{totalCount}</div>
        </div>
      </div>

      {totalCount > 0 && (
        <>
          <div className={styles['accuracy-section']}>
            <h3>せいかいりつ</h3>
            <div className={styles['accuracy-bar']}>
              <div
                className={styles['accuracy-fill']}
                style={{ width: `${accuracy}%` }}
              >
                <span className={styles['accuracy-text']}>{accuracy}%</span>
              </div>
            </div>
            <div className={styles['accuracy-message']}>{getMessage()}</div>
          </div>
          <div className={styles['average-time-section']}>
            <h3>へいきんかいとうじかん</h3>
            <div className={styles['average-time-value']}>
              ⏱️ {averageTime.toFixed(1)}びょう
            </div>
          </div>
        </>
      )}

      <div className={styles['url-info']}>
        <p>
          💡 このページのURLをほぞんすると、けっかをあとでみることができるよ！
        </p>
        <div className={styles['url-display']}>{window.location.href}</div>
      </div>

      <button className={styles['reset-button']} onClick={onReset}>
        🔄 リセット
      </button>

      <button className={styles['back-button']} onClick={onBack}>
        ← もどる
      </button>
    </div>
  )
}

export default Results
