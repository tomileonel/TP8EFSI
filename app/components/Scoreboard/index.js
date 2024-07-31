"use client";
import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
      const parsedScores = JSON.parse(storedScores);
      setScores(parsedScores);
    } else {
      setScores([]);
    }
  }, []);

  const hasScores = scores && scores.length > 0;
  const hasEmptyScores = hasScores && scores.some(entry => entry.score === "");

  return (
    <div className={styles.scoreboard}>
      <h2 className={styles.title}>Scoreboard</h2>
      {hasEmptyScores ? (
        <p className={styles.message}>No has terminado la partida</p>
      ) : hasScores ? (
        <ul className={styles.list}>
          {scores.map((entry, index) => (
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
