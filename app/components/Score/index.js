import React from 'react';
import styles from './style.module.css';

const Score = ({ score }) => {
  return (
    <div className={styles.score}>
      <h2>Score: {score}</h2>
    </div>
  );
};

export default Score;
