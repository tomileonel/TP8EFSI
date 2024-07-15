"use client"
import React, { useState, useEffect } from 'react';
import FlagImage from '../FlagImage';
import GuessInput from '../GuessInput';
import HelpLetters from '../HelpLetters';
import PlayerInput from '../PlayerInput';
import Score from '../Score';
import Timer from '../Timer';
import Scoreboard from '../Scoreboard';
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

  useEffect(() => {

    fetch('https://countriesnow.space/api/v0.1/countries/flag/images')
      .then(response => response.json())
      .then(data => {
        const shuffledCountries = data.data.sort(() => 0.5 - Math.random()).slice(0, 20);
        setCountries(shuffledCountries);
        selectRandomCountry(shuffledCountries);
      });


    if (typeof window !== 'undefined') {
      const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
      setScores(storedScores);
    }
  }, []);

  const selectRandomCountry = (countries) => {
    if (playedCountries.length >= 20) {
      endGame();
      return;
    }

    let randomCountry;
    do {
      randomCountry = countries[Math.floor(Math.random() * countries.length)];
    } while (playedCountries.includes(randomCountry));

    setPlayedCountries([...playedCountries, randomCountry]);
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
      setScore(prevScore => prevScore + 10 + timeLeft); 
      selectRandomCountry(countries);
    } else {
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
    selectRandomCountry(countries);
  };

  const startGame = (name) => {
    setPlayerName(name);
    setGameStarted(true);
    localStorage.setItem('playerName', name);
  };

  const endGame = () => {
    if (currentCountry && timeLeft > 0) {
      setScore(prevScore => prevScore + 10 + timeLeft);
    }

    alert(`Game Over! ${playerName}, your final score is ${score}`);
    setGameStarted(false);
    setPlayedCountries([]);
    setScores(prevScores => {
      const updatedScores = [...prevScores, { player: playerName, score }];
      localStorage.setItem('scores', JSON.stringify(updatedScores));
      return updatedScores;
    });
    setScore(0);
    setCurrentCountry(null);
  };

  return (
    <div className={styles.flagGame}>
      {!gameStarted && <PlayerInput setPlayerName={startGame} />}
      {gameStarted && (
        <>
          <p>Welcome, {playerName}!</p>
          {currentCountry && (
            <>
              <FlagImage flagUrl={currentCountry.flag} />
              <GuessInput handleGuess={handleGuess} />
              <HelpLetters helpLetters={helpLetters} handleHelp={handleHelp} helpUsed={helpUsed} />
              <Score score={score} />
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={handleTimeUp} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FlagGame;