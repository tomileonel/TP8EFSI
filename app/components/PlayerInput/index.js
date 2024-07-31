import React, { useState } from 'react';
import styles from './style.module.css';

const PlayerInput = ({ setPlayerName }) => {
  const [name, setName] = useState('');
  const [flagsCount, setFlagsCount] = useState(2); // Default to 2 flags

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flagsCount <= 100) {
      setPlayerName(name, flagsCount);
    } else {
      alert('The number of flags should be 100 or less.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.playerInput}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        required
      />
      <input
        type="number"
        value={flagsCount}
        onChange={(e) => setFlagsCount(Number(e.target.value))}
        min="1"
        max="100"
        placeholder="Number of flags (1-100)"
        required
      />
      <button type="submit">Start Game</button>
    </form>
  );
};

export default PlayerInput;
