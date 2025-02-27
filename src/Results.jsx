import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from './firebase.js';
import { onSnapshot } from 'firebase/firestore';

const TeamResults = () => {
    const [sport, setSport] = useState('');
    const [teamName, setTeamName] = useState('');
    const [winner, setWinner] = useState('');
    const [runnerUp, setRunnerUp] = useState('');
    const [results, setResults] = useState([
        {sportName: 'Cricket', teamName: 'Yellow', winnerName: 'Pradeep',runnerUpName: '' },
        {sportName: 'Cricket', teamName: 'Blue', winnerName: '',runnerUpName: 'Chandru' }
      ]);

    // Reference to the Firestore collection where results will be stored
    const resultDocRef = doc(db, 'result', 'resultboard');
    // Fetch results from Firestore on component mount
    useEffect(() => {

        const unsubscribe = onSnapshot(resultDocRef, (querySnapshot) => {
            if (querySnapshot.exists()) {
                const fetchedResults = querySnapshot.data();
                setResults((prevResults) => [...prevResults, fetchedResults]);
            } else {
                console.log('Scores not available');
            }
        }, (error) => {
            console.log('Error while fetching real-time data', error);
        });

        // Cleanup function to unsubscribe from the listener
        return () => unsubscribe();


    }, []);

    const handleAddResult = async () => {
        if (sport && teamName && winner && runnerUp) {
            const newResult = {
                sportName: sport,
                teamName: teamName,
                winnerName: winner,
                runnerUpName: runnerUp,
            };

            try {
                // Add the new result to Firestore
                await setDoc(resultDocRef, newResult);
                clearFormFields();
            } catch (error) {
                console.error("Error adding result to Firestore: ", error);
            }
        } else {
            alert('Please fill in all fields before submitting.');
        }
    };

    const clearFormFields = () => {
        setSport('');
        setTeamName('');
        setWinner('');
        setRunnerUp('');
    };

    return (
        <div className="team-results-container">
            <h2>Team Results</h2>

            <div className="input-container">
                <label htmlFor="sport">Sport Name</label>
                <input
                    type="text"
                    id="sport"
                    placeholder="Enter sport name"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                />
            </div>

            <div className="input-container">
                <label htmlFor="teamName">Team Name</label>
                <input
                    type="text"
                    id="teamName"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
            </div>

            <div className="input-container">
                <label htmlFor="winner">Winner Team</label>
                <input
                    type="text"
                    id="winner"
                    placeholder="Enter winning team"
                    value={winner}
                    onChange={(e) => setWinner(e.target.value)}
                />
            </div>

            <div className="input-container">
                <label htmlFor="runnerUp">Runner-up Team</label>
                <input
                    type="text"
                    id="runnerUp"
                    placeholder="Enter runner-up team"
                    value={runnerUp}
                    onChange={(e) => setRunnerUp(e.target.value)}
                />
            </div>

            <button onClick={handleAddResult} className="add-button">
                Add
            </button>

            {results.length > 0 && (
                <div className="results-list">
                    <h3>Results:</h3>
                    {results.map((result, index) => (
                        <div key={index} className="result-item">
                            <p>
                                <strong>{result.sportName}</strong>: {result.teamName} |
                                {result.winnerName} (Winner) |{' '}
                                {result.runnerUpName} (Runner-up)
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamResults;
