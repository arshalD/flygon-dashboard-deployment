import React from 'react';
import ReactDOM from 'react-dom';
import firebase from "firebase/app";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// apiKey: "AIzaSyAwDMpaSqJLF2CrGDuLZVJf4T9S9ZWeuJA",
// authDomain: "awesome-23720.firebaseapp.com",
// projectId: "awesome-23720",
// storageBucket: "awesome-23720.appspot.com",
// messagingSenderId: "644683392435",
// appId: "1:644683392435:web:bcc1f8b62dd0e9a62c57c6",
// measurementId: "G-X2K0DHSR2H"

const firebaseConfig = {
  apiKey: "AIzaSyB6wPkcErEvpAjCukapRmwI9STRM-pCf-s",
  authDomain: "flygon-2894d.firebaseapp.com",
  projectId: "flygon-2894d",
  storageBucket: "flygon-2894d.appspot.com",
  messagingSenderId: "128728646875",
  appId: "1:128728646875:web:d5fdb8b2e78f4c810a78fe",
  measurementId: "G-QPR1J8JK64"
 };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
