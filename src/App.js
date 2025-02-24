import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from './firebase.js';
import { onSnapshot } from 'firebase/firestore';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Scoreboard.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');
  const [isChart, setIsChart] = useState(false);
  const [scores, setScores] = useState({
    red: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 },
    green: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 },
    blue: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 },
    yellow: { cricket: 0, badminton: 0, throwball: 0, Relay: 0, TableTennis: 0, Lagori: 0, Chess: 0, Swimming: 0, Football: 0, total: 0 }
  });

  const scoresDocRef = doc(db, 'scores', 'scoreboard');
  const loginDocRef = doc(db, 'login', 'loginboard');

  useEffect(() => {
    
    const storedUsername = sessionStorage.getItem('username');
    const valid = JSON.parse(sessionStorage.getItem('validUser'));
    setUsername(storedUsername);
    setIsAdmin(valid);
    
    const unsubscribe = onSnapshot(scoresDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const orderedScores = {
          red: { ...scores.red, ...data.red },
          green: { ...scores.green, ...data.green },
          blue: { ...scores.blue, ...data.blue },
          yellow: { ...scores.yellow, ...data.yellow },
        };
        setScores(orderedScores);
      } else {
        console.log('Scores not available');
      }
    }, (error) => {
      console.log('Error while fetching real-time data', error);
    });
  
    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);
  
  const handleLogin = async () => {
    if (enteredUsername) {
      sessionStorage.setItem('username', enteredUsername);
      setUsername(enteredUsername);
      try {
        const docUserSnap = await getDoc(loginDocRef);
        if (docUserSnap.exists()) {
          const userAuthName = docUserSnap.data().admin;
          setIsAdmin(enteredUsername === userAuthName);
          sessionStorage.setItem('validUser', JSON.stringify(enteredUsername === userAuthName));
        } else {
          console.log('login doc');
        }
      } catch (error) {
        console.log('Error fectching logindoc', error);
      }
    }
  };

  const handleScoreChange = async (team, game, value) => {
    if (!isAdmin) return;

    const updatedValue = parseInt(value) || 0;
    const updatedTeamScores = { ...scores[team], [game]: updatedValue };

    const updatedTotal = Object.keys(updatedTeamScores)
      .filter(key => key !== 'total')
      .reduce((sum, key) => sum + updatedTeamScores[key], 0);

    const updatedScores = {
      ...scores,
      [team]: { ...updatedTeamScores, total: updatedTotal }
    };

    setScores(updatedScores);

    try {
      await setDoc(scoresDocRef, updatedScores);
      console.log("Scores updated successfully");
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('validUser');
    setUsername('');
    setIsAdmin(false);
    setEnteredUsername('');
    setIsChart(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        title: { display: true, text: 'Teams', color: '#333', font: { size: 16, weight: 'bold' } },
        ticks: { color: '#333', font: { size: 14 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        title: { display: true, text: 'Total Score', color: '#333', font: { size: 16, weight: 'bold' } },
        ticks: { color: '#333', font: { size: 14 } },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        footerColor: '#fff',
        callbacks: { label: (tooltipItem) => `Score: ${tooltipItem.raw}` },
      },
      legend: { position: 'top', labels: { fontColor: '#333', fontSize: 14 } },
      title: {
        display: true,
        text: 'Team Scores Comparison',
        font: { size: 20, weight: 'bold' },
        color: '#333',
      },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      point: { radius: 6, backgroundColor: '#FF5733', borderColor: '#fff', borderWidth: 2 },
    },
    layout: { padding: { top: 20, right: 20, bottom: 20, left: 20 } },
    backgroundColor: '#f4f4f4',
  };

  const chartData = {
    labels: ['Red', 'Green', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Total Scores',
        data: Object.keys(scores).map(team => scores[team].total),
        borderColor: 'rgba(194, 134, 29, 0.86)',
        backgroundColor: 'rgba(194, 134, 29, 0.86)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(194, 134, 29, 0.86)',
        pointBorderColor: 'rgba(194, 134, 29, 0.86)',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  return (
    <div className="App">
      {!username ? (
        <div className="loginpage">
          <div className='login-container'>
            <h1 style={{ color: 'rgb(34 30 189)' }}>Login Page</h1>
            <InputGroup className="mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <FormControl
                value={enteredUsername}
                onChange={(e) => setEnteredUsername(e.target.value)}
                placeholder="Enter Username"
              />
              <Button variant="success" onClick={handleLogin}>Login</Button>
            </InputGroup>
          </div>
        </div>
      ) : (
        <>
          <header className="headercontent">
            <h3 className='text'>Welcome {isAdmin ? "admin" : " " + username}</h3>
            <h1 className='headername'>Spardhey 2025 ScoreBoard</h1>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </header>
          <div className='viewpos'>
            <Button variant="success" onClick={() => setIsChart(true)} hidden={isChart}>View Graph</Button>
          </div>

          {isChart ? (
            <>
              <div className='viewpos'>
                <Button variant="success" className='viewpos' onClick={() => setIsChart(false)}>View Scoreboard</Button>
              </div>
              <div className='linegraph'>
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          ) : (
            <div className='tablepos'>
              <table className="scoreboard-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    {Object.keys(scores.blue).filter(x => x !== 'total').map((value, index) => (
                      <th key={index}>{value}</th>
                    ))}
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
                            className="celebrate"
                            value={scores[team][value]}
                            onChange={(e) => handleScoreChange(team, value, e.target.value)}
                            disabled={!isAdmin}
                          />
                        </td>
                      ))}
                      <td>
                        <input
                          type="number"
                          className="celebrate"
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
        </>
      )}
    </div>
  );
};

export default App;