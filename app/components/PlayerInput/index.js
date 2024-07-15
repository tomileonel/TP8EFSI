
import React, { useState } from 'react';
import styles from './style.module.css';

const PlayerInput = ({ setPlayerName }) => {
  const [name, setName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlayerName(name);
    setIsNameSet(true);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.playerInput}>
      {!isNameSet ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit">Start Game</button>
        </>
      ) : (
        <p>Welcome, {name}!</p>
      )}
    </form>
  );
};

export default PlayerInput;
