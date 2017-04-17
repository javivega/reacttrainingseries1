import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => { //onAuthStateChange me devuelve un objeto user
      this.setState({
        user: user
      })
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesion`))
      .catch(error => console.log(`Ha ocurrido un error: ${error.code}:${error.message}`));
  }

  handleLogOut(){
    firebase.auth().signOut() //devuelve una promesa
      .then(result => console.log(`${result.user.email} ha salido`))
      .catch(error => console.log(`Ha ocurrido un error: ${error.code}:${error.message}`));
  }

  renderLoginButton() {
    //Comprueba si el usuario esta logeado
    if (this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola {this.state.user.displayName} </p>
          <button onClick={this.handleLogOut}>Logout</button>
        </div>
      );

    } else {
      return (
        <button onClick={this.handleAuth}>Log with google</button>
      );
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
