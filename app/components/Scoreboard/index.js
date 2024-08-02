"use client";
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
      const parsedScores = JSON.parse(storedScores);
      const sortedScores = parsedScores.sort((a, b) => b.score - a.score);
      setScores(sortedScores);
    } else {
      setScores([]);
    }
  }, []);

  const hasScores = scores.length > 0;
  const hasEmptyScores = hasScores && scores.some(entry => entry.score === "");
  console.log(scores)

  return (
    <div className={styles.scoreboard}>
      <h2 className={styles.title}>Scoreboard</h2>
      {hasEmptyScores ? (
        <p className={styles.message}>No has terminado la partida</p>
      ) : hasScores ? (
        <ul className={styles.list}>
          {scores.slice(0, 5).map((entry, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.playerName}>{entry.player}:</span>
              <span className={styles.score}>{entry.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.message}>¡Sé el primero en jugar!</p>
      )}
    </div>
  );
};

export default Scoreboard;

