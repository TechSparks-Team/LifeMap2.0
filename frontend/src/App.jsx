import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: Ensure your backend is running on port 5000
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">MERN Stack Initialized</h1>
        <p className="subtitle">Premium Development Environment</p>
        
        <div className="status-box">
          <h2>Backend Status</h2>
          {loading ? (
            <div className="loader"></div>
          ) : data ? (
            <div className="success-message">
              <span className="dot"></span>
              {data.message}
            </div>
          ) : (
            <div className="error-message">
              Backend disconnected. Check console.
            </div>
          )}
        </div>

        <button className="cta-button">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
