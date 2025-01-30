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
      if (enteredUsername === 'Prad@2025') {
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
        <div className='logincenter'>
          <header>
            <h1>Login Page</h1>
          </header>
          <div className="login-container">
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
        <div>
          <header>
            <div className='logoutcorner'>
              <button className='logoutbutton' onClick={handleLogout}>Logout</button>
            </div>
            <div  className='usernamecenter'>
              <span>Welcome</span>
              <span>{username === "Prad@2025" ? "" : username}</span>
            </div>
            <h1>Spardhey 2025 ScoreBoard</h1>
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
                      className='celebrate'
                      value={scores[team].cricket}
                      onChange={(e) => handleScoreChange(team, 'cricket', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className='celebrate'
                      value={scores[team].badminton}
                      onChange={(e) => handleScoreChange(team, 'badminton', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className='celebrate'
                      value={scores[team].throwball}
                      onChange={(e) => handleScoreChange(team, 'throwball', e.target.value)}
                      disabled={!isAdmin}
                    />
                  </td>
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
      )}
    </div>
  );
};

export default App;
