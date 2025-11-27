import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import './Predictions.css';

// Standard F1 driver list (2024 season - update as needed)
const DRIVERS = [
  'VER', 'PER', 'LEC', 'SAI', 'HAM', 'RUS', 'NOR', 'PIA',
  'ALO', 'STR', 'OCO', 'GAS', 'BOT', 'ZHO', 'ALB', 'SAR',
  'MAG', 'HUL', 'TSU', 'RIC'
];

function Predictions() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [sessionType, setSessionType] = useState('race');
  const [positions, setPositions] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [existingPrediction, setExistingPrediction] = useState(null);

  useEffect(() => {
    loadRaces();
  }, []);

  useEffect(() => {
    if (selectedRace && sessionType) {
      loadExistingPrediction();
    }
  }, [selectedRace, sessionType]);

  const loadRaces = async () => {
    try {
      const racesSnapshot = await getDocs(collection(db, 'races'));
      const racesList = racesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRaces(racesList.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error('Error loading races:', error);
    }
  };

  const loadExistingPrediction = async () => {
    if (!auth.currentUser) return;
    
    try {
      const q = query(
        collection(db, 'predictions'),
        where('raceId', '==', selectedRace),
        where('sessionType', '==', sessionType),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const pred = snapshot.docs[0];
        setExistingPrediction({ id: pred.id, ...pred.data() });
        setPositions(pred.data().positions || {});
      } else {
        setExistingPrediction(null);
        setPositions({});
      }
    } catch (error) {
      console.error('Error loading existing prediction:', error);
    }
  };

  const handlePositionChange = (position, driver) => {
    setPositions(prev => ({
      ...prev,
      [position]: driver
    }));
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRace || !auth.currentUser) return;

    setLoading(true);
    setMessage('');

    try {
      const predictionData = {
        raceId: selectedRace,
        sessionType,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        positions,
        createdAt: new Date()
      };

      if (existingPrediction) {
        await updateDoc(doc(db, 'predictions', existingPrediction.id), predictionData);
        setMessage('Prediction updated successfully!');
      } else {
        await addDoc(collection(db, 'predictions'), predictionData);
        setMessage('Prediction submitted successfully!');
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting prediction:', error);
      setMessage('Error submitting prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createNewRace = () => {
    const raceName = prompt('Enter race name (e.g., "Bahrain GP"):');
    if (!raceName) return;

    const raceDate = prompt('Enter race date (YYYY-MM-DD):');
    if (!raceDate) return;

    // Add race to Firestore
    addDoc(collection(db, 'races'), {
      name: raceName,
      date: raceDate,
      createdAt: new Date()
    }).then(() => {
      loadRaces();
      setMessage('Race created! Select it above.');
    }).catch(error => {
      console.error('Error creating race:', error);
      setMessage('Error creating race.');
    });
  };

  return (
    <div className="predictions-container">
      <div className="predictions-header">
        <h1>📝 Submit Prediction</h1>
        <p>Predict the finishing positions for a race or qualifying session</p>
      </div>

      <div className="predictions-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Race</label>
              <div className="select-wrapper">
                <select
                  value={selectedRace}
                  onChange={(e) => setSelectedRace(e.target.value)}
                  required
                >
                  <option value="">Select a race</option>
                  {races.map(race => (
                    <option key={race.id} value={race.id}>
                      {race.name} ({new Date(race.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={createNewRace}
                  className="add-race-btn"
                >
                  + New Race
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Session Type</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                required
              >
                <option value="race">Race</option>
                <option value="quali">Qualifying</option>
                <option value="sprint">Sprint Race</option>
                <option value="sprint-quali">Sprint Qualifying</option>
              </select>
            </div>
          </div>

          {selectedRace && (
            <div className="positions-grid">
              <h3>Predicted Positions</h3>
              <div className="positions-list">
                {Array.from({ length: 20 }, (_, i) => i + 1).map(position => (
                  <div key={position} className="position-item">
                    <span className="position-number">P{position}</span>
                    <select
                      value={positions[position] || ''}
                      onChange={(e) => handlePositionChange(position, e.target.value)}
                      required
                    >
                      <option value="">Select driver</option>
                      {DRIVERS.map(driver => (
                        <option key={driver} value={driver}>
                          {driver}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading || !selectedRace}>
            {loading ? 'Submitting...' : existingPrediction ? 'Update Prediction' : 'Submit Prediction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Predictions;

