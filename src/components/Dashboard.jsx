import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { calculateScores } from '../utils/scoring';
import './Dashboard.css';

function Dashboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRace, setSelectedRace] = useState('all');

  useEffect(() => {
    loadDashboard();
  }, [selectedRace]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Get all races
      const racesSnapshot = await getDocs(collection(db, 'races'));
      const races = racesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get all predictions
      const predictionsSnapshot = await getDocs(collection(db, 'predictions'));
      const predictions = predictionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get all results
      const resultsSnapshot = await getDocs(collection(db, 'results'));
      const results = resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Calculate scores
      // Create a map of results by raceId and sessionType
      const raceResults = {};
      results.forEach(result => {
        const key = `${result.raceId}_${result.sessionType}`;
        raceResults[key] = result.positions;
      });

      const userScores = {};
      
      // Filter races if needed
      const filteredRaces = selectedRace === 'all' 
        ? races 
        : races.filter(r => r.id === selectedRace);

      filteredRaces.forEach(race => {
        // Process each prediction
        predictions
          .filter(p => p.raceId === race.id)
          .forEach(prediction => {
            // Find matching result for this race and session type
            const resultKey = `${prediction.raceId}_${prediction.sessionType}`;
            const raceResult = raceResults[resultKey];
            
            // Only calculate score if result exists
            if (!raceResult) return;

            if (!userScores[prediction.userId]) {
              userScores[prediction.userId] = {
                userId: prediction.userId,
                userEmail: prediction.userEmail,
                totalPoints: 0,
                races: {}
              };
            }

            const points = calculateScores(prediction.positions, raceResult);
            userScores[prediction.userId].totalPoints += points;
            
            // Use a unique key for race + session type
            const raceKey = `${race.id}_${prediction.sessionType}`;
            userScores[prediction.userId].races[raceKey] = {
              raceName: race.name,
              points,
              sessionType: prediction.sessionType
            };
          });
      });

      const scoresArray = Object.values(userScores).sort((a, b) => b.totalPoints - a.totalPoints);
      setScores(scoresArray);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Track your F1 prediction scores</p>
      </div>

      {scores.length === 0 ? (
        <div className="empty-state">
          <p>No predictions or results yet. Start by submitting predictions!</p>
        </div>
      ) : (
        <div className="scores-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Total Points</th>
                <th>Races</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.userId}>
                  <td className="rank">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </td>
                  <td className="player">{score.userEmail}</td>
                  <td className="points">{score.totalPoints}</td>
                  <td className="races">
                    {Object.values(score.races).map((race, idx) => (
                      <span key={idx} className="race-badge">
                        {race.raceName} ({race.sessionType}): {race.points}pt{race.points !== 1 ? 's' : ''}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

