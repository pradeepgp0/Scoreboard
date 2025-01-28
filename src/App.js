import React, { useState, useEffect } from 'react';
import './Scoreboard.css';

const ScoreBoard = () => {
  // States to hold the login status and scores
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [scores, setScores] = useState({
    red: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
    green: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
    blue: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
    yellow: { cricket: 0, badminton: 0, throwball: 0, total: 0 },
  });

  // On component mount, check for saved username and scores in localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      if (storedUsername === 'admin') {
        setIsAdmin(true); // Grant admin access if the username is "admin"
      }
    }

    // Load saved scores from localStorage if available
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  // Handle login submission
  const handleLogin = () => {
    if (enteredUsername) {
      // Store username in localStorage
      localStorage.setItem('username', enteredUsername);
      setUsername(enteredUsername);
      if (enteredUsername === 'admin') {
        setIsAdmin(true); // Admin can edit scores
      } else {
        setIsAdmin(false); // Regular user can only view scores
      }
    }
  };

  // Handle score changes
  const handleScoreChange = (team, game, value) => {
    if (!isAdmin) return; // Prevent non-admins from editing scores
    const newScores = { ...scores };
    newScores[team][game] = parseInt(value) || 0;
    newScores[team].total = newScores[team].cricket + newScores[team].badminton + newScores[team].throwball;

    setScores(newScores);
    // Save updated scores to localStorage
    localStorage.setItem('scores', JSON.stringify(newScores));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setIsAdmin(false);
    // Optionally, remove scores from localStorage when logging out
    // localStorage.removeItem('scores');
  };

  return (
    <div className="App">
      {!username ? (
        // Login page if the user is not logged in
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
                      disabled={!isAdmin} // Disable input for non-admins
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={scores[team].badminton}
                      onChange={(e) => handleScoreChange(team, 'badminton', e.target.value)}
                      disabled={!isAdmin} // Disable input for non-admins
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={scores[team].throwball}
                      onChange={(e) => handleScoreChange(team, 'throwball', e.target.value)}
                      disabled={!isAdmin} // Disable input for non-admins
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

export default ScoreBoard;
