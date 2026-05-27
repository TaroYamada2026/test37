import React, { useState, useEffect, useCallback } from "react";

// --- 定数 ---
const GAME_TIME = 30; // 制限時間（秒）
const HOLE_COUNT = 9; // 穴の数
const MOLE_SPEED = 1000; // もぐらが出る速さ（ミリ秒）

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"waiting" | "playing" | "ended">(
    "waiting"
  );

  // ゲーム開始
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameState("playing");
  };

  // もぐらをランダムに出現させるロジック
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        const randomHole = Math.floor(Math.random() * HOLE_COUNT);
        setActiveHole(randomHole);

        // 一定時間で引っ込む（出現時間より少し短くする）
        setTimeout(() => setActiveHole(null), MOLE_SPEED * 0.8);
      }, MOLE_SPEED);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // カウントダウン
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState("ended");
      setActiveHole(null);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // もぐらを叩いた時の処理
  const hitMole = (index: number) => {
    if (index === activeHole && gameState === "playing") {
      setScore((prev) => prev + 10);
      setActiveHole(null); // 叩いたらすぐ消える
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🕳️ もぐらたたき 🕳️</h1>

      <div style={styles.infoContainer}>
        <div style={styles.infoBox}>
          スコア: <span style={styles.accent}>{score}</span>
        </div>
        <div style={styles.infoBox}>
          のこり: <span style={styles.accent}>{timeLeft}</span>秒
        </div>
      </div>

      {gameState === "waiting" && (
        <button style={styles.button} onClick={startGame}>
          ゲームスタート！
        </button>
      )}

      {gameState === "ended" && (
        <div style={styles.resultContainer}>
          <h2>終了！</h2>
          <p>
            あなたのスコアは <strong>{score}</strong> 点でした！
          </p>
          <button style={styles.button} onClick={startGame}>
            もう一度あそぶ
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {[...Array(HOLE_COUNT)].map((_, i) => (
          <div key={i} style={styles.hole} onClick={() => hitMole(i)}>
            {/* 穴の影 */}
            <div style={styles.holeDark} />

            {/* もぐら本体 */}
            <div
              style={{
                ...styles.mole,
                transform:
                  activeHole === i ? "translateY(0)" : "translateY(100px)",
                opacity: activeHole === i ? 1 : 0,
              }}
            >
              <div style={styles.moleFace}>
                <div style={styles.eyeLeft} />
                <div style={styles.eyeRight} />
                <div style={styles.nose} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- スタイル ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#e0f2f1", // 優しい水色
    fontFamily:
      '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
    color: "#37474f",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2e7d32",
    marginBottom: "20px",
  },
  infoContainer: {
    display: "flex",
    gap: "30px",
    marginBottom: "20px",
  },
  infoBox: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    backgroundColor: "#fff",
    padding: "10px 20px",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  accent: {
    color: "#ff7043",
    fontSize: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 120px)",
    gridGap: "20px",
    backgroundColor: "#8d6e63", // 土っぽい茶色
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
  },
  hole: {
    position: "relative",
    width: "100px",
    height: "100px",
    backgroundColor: "#5d4037",
    borderRadius: "50%",
    overflow: "hidden", // もぐらが下から出てくるように見せる
    cursor: "pointer",
  },
  holeDark: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    height: "30%",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  mole: {
    position: "absolute",
    width: "80px",
    height: "90px",
    backgroundColor: "#a1887f", // もぐら色
    borderRadius: "40px 40px 10px 10px",
    left: "10px",
    top: "10px",
    transition: "transform 0.1s ease-out, opacity 0.1s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "3px solid #6d4c41",
  },
  moleFace: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  eyeLeft: {
    position: "absolute",
    width: "8px",
    height: "8px",
    backgroundColor: "#000",
    borderRadius: "50%",
    top: "30%",
    left: "25%",
  },
  eyeRight: {
    position: "absolute",
    width: "8px",
    height: "8px",
    backgroundColor: "#000",
    borderRadius: "50%",
    top: "30%",
    right: "25%",
  },
  nose: {
    position: "absolute",
    width: "12px",
    height: "8px",
    backgroundColor: "#ff8a80",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%)",
  },
  button: {
    fontSize: "1.2rem",
    padding: "10px 25px",
    backgroundColor: "#ff7043",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    marginBottom: "20px",
    boxShadow: "0 4px #d84315",
    transition: "0.1s",
  },
  resultContainer: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
};

export default App;
