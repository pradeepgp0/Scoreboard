import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from './firebase.js';
import './Scoreboard.css';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [scores, setScores] = useState({
    red: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 },
    green: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 },
    blue: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 },
    yellow: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 }
  });

  const scoresDocRef = doc(db, 'scores', 'scoreboard');

  // Load data from Firestore on mount
  useEffect(() => {
    const loadScores = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        if (storedUsername === 'Prad@2025') {
          setIsAdmin(true);
        }
      }

      const docSnap = await getDoc(scoresDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Fix the order of teams
        const orderedScores = {
          red: {
            ...{
              cricket: 0,
              badminton: 0,
              throwball: 0,
              Relay: 0,
              TableTennis: 0,
              Lagori: 0,
              Chess: 0,
              Swimming: 0,
              Football: 0,
              total: 0,
            },
            ...data.red,
          },
          green: {
            ...{
              cricket: 0,
              badminton: 0,
              throwball: 0,
              Relay: 0,
              TableTennis: 0,
              Lagori: 0,
              Chess: 0,
              Swimming: 0,
              Football: 0,
              total: 0,
            },
            ...data.green,
          },
          blue: {
            ...{
              cricket: 0,
              badminton: 0,
              throwball: 0,
              Relay: 0,
              TableTennis: 0,
              Lagori: 0,
              Chess: 0,
              Swimming: 0,
              Football: 0,
              total: 0,
            },
            ...data.blue,
          },
          yellow: {
            ...{
              cricket: 0,
              badminton: 0,
              throwball: 0,
              Relay: 0,
              TableTennis: 0,
              Lagori: 0,
              Chess: 0,
              Swimming: 0,
              Football: 0,
              total: 0,
            },
            ...data.yellow,
          },
        };
        setScores(orderedScores);
      }
    };
    loadScores();
  }, []);

  // Handle login
  const handleLogin = () => {
    if (enteredUsername) {
      localStorage.setItem('username', enteredUsername);
      setUsername(enteredUsername);
      if (enteredUsername === 'Prad@2025') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  };

  const handleScoreChange = async (team, game, value) => {
    if (!isAdmin) return;

    // Update the score for the specific game
    const newScores = { ...scores };
    newScores[team][game] = parseInt(value) || 0;

    // Recalculate the total score for the team (sum of all games)
    newScores[team].total = Object.keys(newScores[team])
      .filter(key => key !== 'total') // Exclude 'total' from the summing
      .reduce((sum, key) => sum + newScores[team][key], 0);

    // Update the state with the new scores
    setScores(newScores);

    // Save the updated scores to Firestore
    try {
      await setDoc(scoresDocRef, newScores);
      console.log("Scores updated successfully");
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };



  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setIsAdmin(false);
    setEnteredUsername('');
  };

  return (
    <div className="App">
      {!username ? (
        <div className='loginpage'>
          <header>
            <h1>Login Page</h1>
          </header>
          <div className="logintextbox">
            <input
              type="text"
              className='usernamecenter'
              placeholder="Enter username"
              value={enteredUsername}
              onChange={(e) => setEnteredUsername(e.target.value)}
            />
            <button className="buttoncenter" onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <>
          <header className='headercontent'>
            <span style={{ color: "green", marginLeft: "12px" }}>Welcome {username === "Prad@2025" ? "" : " " + username}</span>
            <h1>Spardhey 2025 ScoreBoard</h1>
            <span style={{ color: "green", marginRight: "12px" }} onClick={handleLogout} > Logout </span>
          </header>
          <div>
            <table className="scoreboard-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Cricket</th>
                  <th>Badminton</th>
                  <th>Throwball</th>
                  <th>Relay</th>
                  <th>Table Tennis</th>
                  <th>Lagori</th>
                  <th>Chess</th>
                  <th>Swimming</th>
                  <th>Football</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(scores).map((team) => (
                  <tr key={team} className={team}>
                    <td>{team.charAt(0).toUpperCase() + team.slice(1)}</td>
                    {Object.keys(scores[team]).filter(x => x !== 'total').map((value, index) => (
                      <td key={index}>
                        <input
                          type="number"
                          className='celebrate'
                          value={scores[team][value]}
                          onChange={(e) => handleScoreChange(team, value, e.target.value)}
                          disabled={!isAdmin}
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="number"
                        className='celebrate'
                        value={scores[team].total}
                        disabled={true}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
