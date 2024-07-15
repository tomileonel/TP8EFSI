
import React from 'react';
import styles from './style.module.css';

const HelpLetters = ({ helpLetters, handleHelp, helpUsed }) => {
  return (
    <div className={styles.helpLetters}>
      {!helpUsed && <button onClick={handleHelp}>Get Help (-2s)</button>}
      <p>{helpLetters}</p>
    </div>
  );
};

export default HelpLetters;
