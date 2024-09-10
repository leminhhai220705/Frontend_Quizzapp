import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ResultScreen from './ResultScreen';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [polls, setPolls] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']); // Initialize with 4 empty options
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get('http://localhost:9000/api/polls')
        .then((response) => setPolls(response.data))
        .catch((error) => console.error(error));
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    axios
      .post('http://localhost:9000/api/login', { username, password })
      .then(() => {
        setIsAuthenticated(true);
        setLoginError('');
      })
      .catch(() => setLoginError('Invalid username or password'));
  };

  const handleAddPoll = () => {
    if (newOptions.some((option) => option.trim() === '')) {
      alert('Please provide all 4 options.');
      return;
    }
    axios
      .post('http://localhost:9000/api/polls', { question: newQuestion, options: newOptions })
      .then((response) => {
        setPolls([...polls, response.data]);
        setNewQuestion('');
        setNewOptions(['', '', '', '']); // Reset options
        alert('Poll added successfully');
      })
      .catch((error) => console.error(error));
  };

  const handleVote = () => {
    if (selectedOption !== null && polls[currentPollIndex]) {
      axios
        .post('http://localhost:9000/api/vote', {
          pollId: polls[currentPollIndex].id,
          option: selectedOption,
        })
        .then((response) => {
          const updatedPoll = response.data; // Get updated poll with results
          setPolls((prevPolls) =>
            prevPolls.map((poll) =>
              poll.id === updatedPoll.id ? updatedPoll : poll
            )
          );

          if (currentPollIndex < polls.length - 1) {
            setCurrentPollIndex((prevIndex) => prevIndex + 1);
            setSelectedOption(null);
          } else {
            // If it's the last question, show results
            setShowResult(true);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const handleShowResults = () => {
    setShowResult(true);
  };

  const handleReturnToHome = () => {
    setShowResult(false);
    setCurrentPollIndex(0); // Reset poll index
    setSelectedOption(null); // Clear selected option
  };

  if (!isAuthenticated) {
    return (
      <div className="App light-mode">
        <header className="App-header">
          <h1 className="app-title">Poll App</h1>
        </header>

        <div className="login-container">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>Login</button>
          {loginError && <p className="error">{loginError}</p>}
        </div>
      </div>
    );
  }

  if (showResult) {
    return <ResultScreen polls={polls} onReturn={handleReturnToHome} />;
  }

  return (
    <div className="App light-mode">
      <header className="App-header">
        <h1 className="app-title">Poll App</h1>
        <button className="logout-button" onClick={() => setIsAuthenticated(false)}>Logout</button>
      </header>

      <div className="poll-container">
        {polls.length > 0 && (
          <div>
            <h2>{polls[currentPollIndex].question}</h2>
            {polls[currentPollIndex].options.map((option) => (
              <div className="option" key={option}>
                <input
                  type="radio"
                  name="poll-option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <span className="option-label">{option}</span>
              </div>
            ))}
            <button className="submit-button" onClick={handleVote}>Submit Vote</button>
            <button className="next-button" onClick={handleShowResults}>Show Results</button>
          </div>
        )}
      </div>

      <div className="new-poll-container">
        <h2>Add New Poll</h2>
        <input
          type="text"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        {newOptions.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const updatedOptions = [...newOptions];
              updatedOptions[index] = e.target.value;
              setNewOptions(updatedOptions);
            }}
          />
        ))}
        <button className="submit-button" onClick={handleAddPoll}>Add Poll</button>
      </div>
    </div>
  );
}

export default App;
