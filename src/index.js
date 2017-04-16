import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.css';


firebase.initializeApp({
  apiKey: "AIzaSyB0AAWwhyHuuyItALTKbQJ4e4apUoiGYq0",
  authDomain: "pseudogram-21afb.firebaseapp.com",
  databaseURL: "https://pseudogram-21afb.firebaseio.com",
  projectId: "pseudogram-21afb",
  storageBucket: "pseudogram-21afb.appspot.com",
  messagingSenderId: "1050105365722"
});


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
