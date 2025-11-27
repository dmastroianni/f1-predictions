import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Results.css';

const DRIVERS = [
  'VER', 'PER', 'LEC', 'SAI', 'HAM', 'RUS', 'NOR', 'PIA',
  'ALO', 'STR', 'OCO', 'GAS', 'BOT', 'ZHO', 'ALB', 'SAR',
  'MAG', 'HUL', 'TSU', 'RIC'
];

function Results() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [sessionType, setSessionType] = useState('race');
  const [positions, setPositions] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [existingResult, setExistingResult] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    loadRaces();
  }, []);

  useEffect(() => {
    if (selectedRace && sessionType) {
      loadExistingResult();
    }
  }, [selectedRace, sessionType]);

  const loadRaces = async () => {
    try {
      const racesSnapshot = await getDocs(collection(db, 'races'));
      const racesList = racesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRaces(racesList.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading races:', error);
    }
  };

  const loadExistingResult = async () => {
    try {
      const q = query(
        collection(db, 'results'),
        where('raceId', '==', selectedRace),
        where('sessionType', '==', sessionType)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const result = snapshot.docs[0];
        setExistingResult({ id: result.id, ...result.data() });
        setPositions(result.data().positions || {});
      } else {
        setExistingResult(null);
        setPositions({});
      }
    } catch (error) {
      console.error('Error loading existing result:', error);
    }
  };

  const handlePositionChange = (position, driver) => {
    setPositions(prev => ({
      ...prev,
      [position]: driver
    }));
    setMessage('');
  };

  const handleFetchFromAPI = async () => {
    if (!selectedRace) {
      setMessage('Please select a race first');
      return;
    }

    setFetching(true);
    setMessage('');

    try {
      // Using Ergast API (free, no auth required)
      // Note: This is a simplified example - you'll need to map race names to Ergast format
      const race = races.find(r => r.id === selectedRace);
      if (!race) return;

      // For now, show a message that manual entry is needed
      // In production, you'd parse the race name and fetch from Ergast API
      setMessage('Auto-fetch feature coming soon! For now, please enter results manually.');
      
      // Example API call structure (commented out - needs proper race name mapping):
      /*
      const year = new Date(race.date).getFullYear();
      const round = getRoundNumber(race.name); // You'd need to implement this
      const response = await fetch(`http://ergast.com/api/f1/${year}/${round}/results.json`);
      const data = await response.json();
      // Parse and set positions...
      */
    } catch (error) {
      console.error('Error fetching from API:', error);
      setMessage('Error fetching results. Please enter manually.');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRace) return;

    setLoading(true);
    setMessage('');

    try {
      const resultData = {
        raceId: selectedRace,
        sessionType,
        positions,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (existingResult) {
        await updateDoc(doc(db, 'results', existingResult.id), resultData);
        setMessage('Results updated successfully!');
      } else {
        await addDoc(collection(db, 'results'), resultData);
        setMessage('Results saved successfully!');
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving results:', error);
      setMessage('Error saving results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteResults = () => {
    const pasteText = prompt('Paste results (one driver code per line, in finishing order):');
    if (!pasteText) return;

    const lines = pasteText.trim().split('\n').filter(line => line.trim());
    const newPositions = {};
    
    lines.forEach((driver, index) => {
      const driverCode = driver.trim().toUpperCase();
      if (DRIVERS.includes(driverCode)) {
        newPositions[index + 1] = driverCode;
      }
    });

    if (Object.keys(newPositions).length > 0) {
      setPositions(newPositions);
      setMessage(`Loaded ${Object.keys(newPositions).length} positions`);
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('No valid driver codes found. Please check format.');
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>🏁 Enter Results</h1>
        <p>Enter the actual finishing positions for a race or qualifying session</p>
      </div>

      <div className="results-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Race</label>
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

          <div className="action-buttons">
            <button
              type="button"
              onClick={handlePasteResults}
              className="action-btn paste-btn"
            >
              📋 Paste Results
            </button>
            <button
              type="button"
              onClick={handleFetchFromAPI}
              className="action-btn fetch-btn"
              disabled={fetching}
            >
              {fetching ? 'Fetching...' : '🌐 Fetch from API (Coming Soon)'}
            </button>
          </div>

          {selectedRace && (
            <div className="positions-grid">
              <h3>Actual Finishing Positions</h3>
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
            {loading ? 'Saving...' : existingResult ? 'Update Results' : 'Save Results'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Results;

