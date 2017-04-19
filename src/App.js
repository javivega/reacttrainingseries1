import React, { Component } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import firebase from 'firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user
      })
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => { console.log(`Logeado correctamente el user: ${result.user.email}`) })
      .catch(error => { console.log(`Error:  ${error.code} : ${error.message}`) })
  }

  handleLogOut() {
    firebase.auth().signOut()
      .then(result => { console.log("Logout con exito") })
      .catch(error => { console.log(`Error:  ${error.code} : ${error.message}`) })

  }

  renderLoginButton() {
    if (this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>{this.state.user.displayName}</p>
          <button onClick={this.handleLogOut}>Logout</button>
          <FileUpload />
        </div>
      )
    } else {
      return (<button onClick={this.handleAuth}>Login with google</button>)
    }
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <p className="App-intro">
          {this.renderLoginButton()}
        </p>
      </div>
    );
  }
}

export default App;
