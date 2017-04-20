import React, { Component } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import firebase from 'firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    //Aqui tenemos un listener para la autenticacion, que cuando cambia el usuario autenticado hace lo siguiente.
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user
      })
    })
    //Igual que tenemos un listener para la autenticacion ponemos otro para la base de datos
    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        //con concat cada vez que añadimos un hijo creamos un nuevo array con todo el contenido de la base de datos(snapshot)
        pictures: this.state.pictures.concat(snapshot.val())
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

  handleUpload(event){
        //obtenemos el archivo que se ha subido
        const file = event.target.files[0];
        //definimos una referencia al storage de firebase
        const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
        //para subir el fichero cojo la referencia del archivo en el storage y con el put subo el archivo
        const task = storageRef.put(file);

        //el task tiene un evento on el cual puede escuchar eventos uno de ellos es state_changed
        //este evento devuelve un snapshot del storage en ese momento o de la subida
        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({
                uploadValue: percentage
            })
        }, error => {
            console.log(error.message);
        }, () => {
          //Con esto de debajo tenemos el objeto que queremos almacenar en la base de datos
            const record = {
              photoURL: this.state.user.photoURL,
              displayName: this.state.user.displayName,
              image: task.snapshot.downloadURL
            };

            //ahora que tengo el objeto creado con los datos a almacenar lo almacenamos
            const dbRef = firebase.database().ref('pictures')
            //creamos el huevo en la base de datos para añadir el nuevo registro
            const newPicture = dbRef.push();
            //guardamos en el hueco el objeto creado.
            newPicture.set(record);

        })
    }

  renderLoginButton() {
    if (this.state.user) {
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>{this.state.user.displayName}</p>
          <button onClick={this.handleLogOut}>Logout</button>
          <FileUpload onUpload={this.handleUpload}/>

          {this.state.pictures.map(picture => (
            <div>
              <img src={picture.image} alt=""/>
              <br/>
              <img src={picture.photoURL} alt={picture.displayName}/>
               <br/>
               <span>{picture.displayName}</span>
            </div>
          )).reverse()}
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
