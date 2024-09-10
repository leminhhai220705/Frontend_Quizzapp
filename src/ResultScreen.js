import React from 'react';
import './ResultScreen.css';

function ResultScreen({ polls, onReturn }) {
  if (!polls || polls.length === 0) {
    return (
      <div className="result-screen">
        <h2 className="result-title">No Polls Available</h2>
        <div className="button-container">
          <button className="return-button" onClick={onReturn}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-screen">
      <h2 className="result-title">Poll Results</h2>
      {polls.map((poll) => (
        <div key={poll.id} className="result-card">
          <h3 className="result-question">{poll.question}</h3>
          <ul className="results-list">
            {poll.votes && Object.entries(poll.votes).map(([option, votes]) => (
              <li key={option} className="result-option">
                <span>{option}</span>
                <span>{votes} votes</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="button-container">
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
        <button className="return-button" onClick={onReturn}>
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
