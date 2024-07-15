import React, { useEffect } from 'react';
import styles from './style.module.css';

const Timer = ({ timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      onTimeUp();
    }
  }, [timeLeft]);

  return (
    <div className={styles.timer}>
      <h2>Time Left: {timeLeft}s</h2>
    </div>
  );
};

export default Timer;
