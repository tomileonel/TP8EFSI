"use client"
import React from 'react';
import styles from './style.module.css';

const Scoreboard = ({ scores }) => {
  if (!scores || scores.length === 0) {
    return (
      <div className={styles.scoreboard}>
        <h2>Scoreboard</h2>
        <p>¡Sé el primero en jugar!</p>
      </div>
    );
  }

  return (
    <div className={styles.scoreboard}>
      <h2>Scoreboard</h2>
      <ul>
        {scores.map((entry, index) => (
          <li key={index}>{entry.player}: {entry.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;