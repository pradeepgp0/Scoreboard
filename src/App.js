import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from './firebase.js';
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

    const newScores = { ...scores };
    newScores[team][game] = parseInt(value) || 0;

    newScores[team].total = Object.keys(newScores[team])
      .filter(key => key !== 'total')
      .reduce((sum, key) => sum + newScores[team][key], 0);

    setScores(newScores);

    try {
      await setDoc(scoresDocRef, newScores);
      console.log("Scores updated successfully");
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setIsAdmin(false);
    setEnteredUsername('');
    setIsChart(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow resizing without distortion
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light grid lines
        },
        title: {
          display: true,
          text: 'Teams', // X-axis title
          color: '#333',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333', // Color for the ticks (team names)
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light grid lines
        },
        title: {
          display: true,
          text: 'Total Score', // Y-axis title
          color: '#333',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333', // Color for the ticks (scores)
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background color
        titleColor: '#fff',
        bodyColor: '#fff',
        footerColor: '#fff',
        callbacks: {
          label: function (tooltipItem) {
            return `Score: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        position: 'top', // Position of the legend
        labels: {
          fontColor: '#333',
          fontSize: 14,
        },
      },
      title: {
        display: true,
        text: 'Team Scores Comparison', // Title of the chart
        font: {
          size: 20,
          weight: 'bold',
        },
        color: '#333',
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth line
        borderWidth: 3, // Line thickness
      },
      point: {
        radius: 6, // Point size
        backgroundColor: '#FF5733', // Point color
        borderColor: '#fff', // Point border color
        borderWidth: 2, // Point border width
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    backgroundColor: '#f4f4f4', // Background color of the entire chart area
  };

  const chartData = {
    labels: ['Red', 'Green', 'Blue', 'Yellow'], // Team names
    datasets: [
      {
        label: 'Total Scores',
        data: [
          scores.red.total,
          scores.green.total,
          scores.blue.total,
          scores.yellow.total,
        ],
        borderColor: '#FF5733', // Line color
        backgroundColor: 'rgba(255, 87, 51, 0.2)', // Line fill color
        fill: true, // Fill the area under the line
        tension: 0.4, // Smooth the line curve
        borderWidth: 3, // Line thickness
        pointBackgroundColor: '#FF5733', // Data points' background color
        pointBorderColor: '#fff', // Data points' border color
        pointBorderWidth: 2, // Data points' border width
        pointRadius: 6, // Data points' size
      },
    ],
  };


  return (
    <div className="App">
      {!username ? (
        <div className="loginpage">
          <header>
            <h1>Login Page</h1>
          </header>
          <div className="logintextbox">
            <input
              type="text"
              className="usernamecenter"
              placeholder="Enter username"
              value={enteredUsername}
              onChange={(e) => setEnteredUsername(e.target.value)}
            />
            <button className="buttoncenter" onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <>
          <header className="headercontent">
            <span style={{ color: "green", marginLeft: "12px" }}>
              Welcome {username === "Prad@2025" ? "" : " " + username}
            </span>
            <h1>Spardhey 2025 ScoreBoard</h1>
            <span style={{ color: "green", marginRight: "12px" }} onClick={handleLogout}> Logout </span>
          </header>
          <div style={{textAlign:'end', marginRight:'10px'}}><button className="view" onClick={() => { setIsChart(true) }} hidden={isChart}>View Chart</button></div>
          {isChart ? (
            <>
              <div style={{textAlign:'end', marginRight:'10px'}}><button className="view" onClick={() => { setIsChart(false) }}>View Scoreboard</button></div>
              <div style={{ width: '80%', margin: '20px auto', height: "60vh" }}>
                <Line style={{ backgroundColor: 'aliceblue', opacity: '0.8' }} data={chartData} options={chartOptions} />
              </div>
            </>
          ) : (<div>
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
      )
      }
    </div >
  );
};

export default App;
