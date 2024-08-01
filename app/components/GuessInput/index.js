import React, { useState } from 'react';
import styles from './style.module.css';

const GuessInput = ({ handleGuess }) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGuess(guess);
    setGuess('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.guessInput}>
      <input
        type="text"
        id="guess"
        name="guess"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter country name"
        required
      />
      <button type="submit">Guess</button>
    </form>
  );
};

export default GuessInput;
