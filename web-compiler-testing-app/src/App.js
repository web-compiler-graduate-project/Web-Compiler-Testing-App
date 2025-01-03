import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('http://localhost:3001/compile');
  const [json, setJson] = useState(`{
    "file": "test"
  }`);
  const [numRequests, setNumRequests] = useState(1);
  const [responseLogs, setResponseLogs] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendRequests = async () => {
    setResponseLogs([]);
    setExecutionTime(null);
    setLoading(true);
    const startTime = Date.now();

    const requests = Array.from({ length: numRequests }, (_, i) =>
      axios.post(url, JSON.parse(json), {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => `Response ${i + 1}: ${JSON.stringify(response.data)}`)
        .catch(error => `Error ${i + 1}: ${error.message}`)
    );

    try {
      const results = await Promise.all(requests);
      setResponseLogs(results);
    } catch (error) {
      setResponseLogs([`Unexpected error: ${error.message}`]);
    } finally {
      const endTime = Date.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(5));
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#1f1f1f',
        color: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        position: 'relative'
      }}>
        <h1>Web Compiler Testing App</h1>
        <div style={{ marginBottom: '10px' }}>
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              backgroundColor: '#2a2a2a',
              color: '#ffffff',
              border: '1px solid #444',
              borderRadius: '4px'
            }}
            placeholder="Enter URL"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>JSON:</label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              height: '150px',
              backgroundColor: '#2a2a2a',
              color: '#ffffff',
              border: '1px solid #444',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Number of Requests:</label>
          <input
            type="number"
            value={numRequests}
            onChange={(e) => setNumRequests(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              backgroundColor: '#2a2a2a',
              color: '#ffffff',
              border: '1px solid #444',
              borderRadius: '4px'
            }}
            min="1"
          />
        </div>
        <button onClick={handleSendRequests} style={{
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#6200ee',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px'
        }}>
          Send Requests
        </button>
        <div style={{ marginTop: '20px' }}>
          <h2>Response Logs:</h2>
          <pre style={{
            backgroundColor: '#2a2a2a',
            padding: '10px',
            height: '200px',
            overflowY: 'scroll',
            color: '#ffffff',
            borderRadius: '4px',
            border: '1px solid #444'
          }}>
            {responseLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </pre>
        </div>
        {executionTime !== null && (
          <div style={{ marginTop: '20px' }}>
            <h2>Execution Time:</h2>
            <p>{executionTime} s</p>
          </div>
        )}
      </div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default App;
