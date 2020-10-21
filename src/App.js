import React from 'react';
import './App.css';
import FbProfile from './components/fbprofile';
import Front from './components/front';
var CLIENT_ID = '1086063754312-edch1mrsn736o472kj9eslkgfkuflj27.apps.googleusercontent.com';
var API_KEY = '1rIdVcjN2ZWrGJjPnXVP1ZzE';
var SCOPES = 'profile';
function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <LoginPage clientId={CLIENT_ID} apiKey={API_KEY} scope={SCOPES} loginChanged={(arg) => console.log("Message from login Component:", arg)} />
     <FbProfile ></FbProfile> */}
      <Front />
    </div>
  );
}

export default App;
