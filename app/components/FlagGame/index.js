"use client";
import React, { useState, useEffect } from 'react';
import FlagImage from '../FlagImage';
import GuessInput from '../GuessInput';
import HelpLetters from '../HelpLetters';
import PlayerInput from '../PlayerInput';
import Score from '../Score';
import Timer from '../Timer';
import styles from './style.module.css';

const FlagGame = () => {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [helpLetters, setHelpLetters] = useState('');
  const [helpUsed, setHelpUsed] = useState(false);
  const [playedCountries, setPlayedCountries] = useState([]);
  const [scores, setScores] = useState([]);
  const [totalFlags, setTotalFlags] = useState(2);
  const [flagsRemaining, setFlagsRemaining] = useState(2);
  const [previousCountry, setPreviousCountry] = useState(null);

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
      .then(response => response.json())
      .then(data => {
        const shuffledCountries = data.data.sort(() => 0.5 - Math.random()).slice(0, totalFlags);
        setCountries(shuffledCountries);
        selectRandomCountry(shuffledCountries);
      });

    if (typeof window !== 'undefined') {
      const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
      setScores(storedScores);
    }
  }, [totalFlags]);

  const selectRandomCountry = (countries) => {
    if (flagsRemaining <= 0) {
      endGame();
      return;
    }

    let randomCountry;
    do {
      randomCountry = countries[Math.floor(Math.random() * countries.length)];
    } while (playedCountries.includes(randomCountry));

    setPreviousCountry(currentCountry);
    setPlayedCountries([...playedCountries, randomCountry]);
    setCurrentCountry(randomCountry);
    setHelpLetters('');
    setHelpUsed(false);
    setTimeLeft(15);
    setFlagsRemaining(prevFlags => prevFlags - 1);
  };

  const generateHelpLetters = (countryName) => {
    const nameLength = countryName.length;
    const numLettersToShow = Math.floor(nameLength / 2);
    const lettersArray = Array(nameLength).fill('_');
    let count = 0;

    while (count < numLettersToShow) {
      const randomIndex = Math.floor(Math.random() * nameLength);
      if (lettersArray[randomIndex] === '_') {
        lettersArray[randomIndex] = countryName[randomIndex];
        count++;
      }
    }

    return lettersArray.join('');
  };

  const handleGuess = (guess) => {
    if (guess.toLowerCase() === currentCountry.name.toLowerCase()) {
      const points = 10 + timeLeft;
      setScore(prevScore => prevScore + points);
      selectRandomCountry(countries);
    } else {
      alert(`Incorrect!`);
    }
  };

  const handleHelp = () => {
    setTimeLeft(prevTime => prevTime - 2);
    setHelpLetters(generateHelpLetters(currentCountry.name));
    setHelpUsed(true);
  };

  const handleTimeUp = () => {
    setScore(prevScore => prevScore - 5);
    alert(`Time's up! The flag was ${currentCountry.name}.`);
    selectRandomCountry(countries);
  };

  const startGame = (name, flagsCount) => {
    setPlayerName(name);
    setTotalFlags(flagsCount);
    setFlagsRemaining(flagsCount);
    setGameStarted(true);
    localStorage.setItem('playerName', name);
  };

  const endGame = () => {
    if (currentCountry && timeLeft > 0) {
      const finalScore = score;
      setScores(prevScores => {
        const updatedScores = [...prevScores, { player: playerName, score: finalScore }];
        localStorage.setItem('scores', JSON.stringify(updatedScores));
        return updatedScores;
      });

      alert(`Game Over! ${playerName}, your final score is ${finalScore}`);

      setGameStarted(false);
      setPlayedCountries([]);
      setScore(0);
      setCurrentCountry(null);
      setFlagsRemaining(0);
    }
  };

  useEffect(() => {
    if (flagsRemaining <= 0 && currentCountry === null) {
      endGame();
    }
  }, [flagsRemaining, currentCountry]);

  return (
    <div className={styles.flagGame}>
      {!gameStarted && <PlayerInput setPlayerName={startGame} />}
      {gameStarted && (
        <>
          <p>Welcome, {playerName}!</p>
          <p>Flags Remaining: {flagsRemaining}</p>
          {currentCountry && (
            <>
              <FlagImage flagUrl={currentCountry.flag} />
              <GuessInput handleGuess={handleGuess} />
              <HelpLetters helpLetters={helpLetters} handleHelp={handleHelp} helpUsed={helpUsed} />
              <Score score={score} />
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={handleTimeUp} />
              <h1>{currentCountry.name}</h1>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FlagGame;
