import React, { useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from './firebase.js';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import './Scoreboard.css';

const VoteComponent = (username) => {
    const [user, setUser] = useState(false);
    const [names, setNamesArray] = useState([]);
    const docRef = doc(db, 'vote', 'voteboard');
    useEffect(() => {


        // Reference to the document where the array is stored


        async function fetchArrayFromFirestore() {
            try {
                setUser(false);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const namesArray = data.names;
                    setNamesArray(namesArray);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document: ', error);
            }
        }

        // Call the function to fetch the array
        fetchArrayFromFirestore();



    }, []);

    const handleVote = async () => {

        if (names ? names.includes(username.username) : false) {
            alert('you already voted');
            return;
        }

        // Add the new fruit to the array without duplicating any existing values
        async function addToArray() {
            try {
                await updateDoc(docRef, {
                    names: arrayUnion(username.username)  // This adds 'Mango' to the 'fruits' array
                });
                alert('New item added to the array');
                setUser(true);
            } catch (error) {
                console.error('Error adding item to array: ', error);
            }
        }

        // Call the function to add a new item
        addToArray();

    };

    return (
        <div className='center'>
            <div className='centerpart'>
                <h2>Please vote for the event</h2>
                <div>
                    <button onClick={() => handleVote()} disabled={user}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default VoteComponent;
