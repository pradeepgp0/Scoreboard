import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from './firebase.js';
import './Scoreboard.css';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [scores, setScores] = useState({
    red: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
    green: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
    blue: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
    yellow: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
  });

  const scoresDocRef = doc(db, 'scores', 'scoreboard');

  // Load data from Firestore on mount
  useEffect(() => {
    const loadScores = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        if (storedUsername === 'admin') {
          setIsAdmin(true);
        }
      }

      const docSnap = await getDoc(scoresDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Fix the order of teams
        const orderedScores = {
          red: data.red,
          green: data.green,
          blue: data.blue,
          yellow: data.yellow,
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
      if (enteredUsername === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  };

  // Handle score changes
  const handleScoreChange = async (team, game, value) => {
    if (!isAdmin) return;
    const newScores = { ...scores };
    newScores[team][game] = parseInt(value) || 0;
    newScores[team].total = newScores[team].cricket + newScores[team].badminton + newScores[team].throwball;

    setScores(newScores);

    // Save the updated scores to Firestore
    try {
      // Use setDoc instead of updateDoc if the document might not exist yet
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
  };

  return (
    <div className="App">
      {!username ? (
        <div className="login-container">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Enter username"
            value={enteredUsername}
            onChange={(e) => setEnteredUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <header>
            <h1>Spardhey 2025 ScoreBoard</h1>
            <div>
              <span>Welcome</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </header>
          <table className="scoreboard-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Cricket</th>
                <th>Badminton</th>
                <th>Throwball</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(scores).map((team) => (
                <tr key={team} className={team}>
                  <td>{team.charAt(0).toUpperCase() + team.slice(1)} Team</td>
                  <td>
                    <input
                      type="number"
                      value={scores[team].cricket}
                      onChange={(e) => handleScoreChange(team, 'cricket', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={scores[team].badminton}
                      onChange={(e) => handleScoreChange(team, 'badminton', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={scores[team].throwball}
                      onChange={(e) => handleScoreChange(team, 'throwball', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </td>
                  <td>{scores[team].total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
