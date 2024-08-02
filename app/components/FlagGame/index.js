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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const data = await response.json();
        const shuffledCountries = data.data.sort(() => 0.5 - Math.random());
        setCountries(shuffledCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();

    if (typeof window !== 'undefined') {
      const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
      setScores(storedScores);
    }
  }, []);

  const selectRandomCountry = () => {
    let availableCountries = countries.filter(country => !playedCountries.includes(country.name));
    if (availableCountries.length === 0) {
      endGame();
      return;
    }
    const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];

    setPlayedCountries(prevPlayed => [...prevPlayed, randomCountry.name]);
    setCurrentCountry(randomCountry);
    setHelpLetters('');
    setHelpUsed(false);
    setTimeLeft(15);
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
      setFlagsRemaining(prevFlags => prevFlags - 1);
    } else {
      alert(`Incorrect!`);
      setScore(prevScore => prevScore - 1);

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
    setFlagsRemaining(prevFlags => prevFlags - 1);
  };

  const startGame = (name, flagsCount) => {
    setPlayerName(name);
    setTotalFlags(flagsCount);
    setFlagsRemaining(flagsCount);
    setGameStarted(true);
    setPlayedCountries([]);
    setScore(0);
    setCurrentCountry(null);
    localStorage.setItem('playerName', name);
  };

  const endGame = () => {
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
    setFlagsRemaining(totalFlags);
    window.location.reload();

  };

  useEffect(() => {
    if (flagsRemaining === 0 && gameStarted) {
      endGame();
    } else if (flagsRemaining > 0 && gameStarted) {
      selectRandomCountry();
    }
  }, [flagsRemaining, gameStarted]);

  useEffect(() => {
    if (gameStarted && countries.length > 0) {
      selectRandomCountry();
    }
  }, [gameStarted, countries]);

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
