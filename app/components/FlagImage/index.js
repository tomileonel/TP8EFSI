import React from 'react';
import styles from './style.module.css';

const FlagImage = ({ flagUrl }) => {
  return <img src={flagUrl} alt="Country Flag" className={styles.flagImage} />;
};

export default FlagImage;
