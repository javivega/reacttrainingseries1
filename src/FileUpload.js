import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component {
    constructor(){
        super();
        this.state = {
            uploadValue: 0,
            picture: null
        };

    this.handleUpload = this.handleUpload.bind(this);
    }
    //Primero defino el archivo a subir luego la referencia de donde en el storage y lo subo con put
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
        }, this.setState({
            uploadValue: 100,
            picture: task.snapshot.downloadURL
        }) )
    }

    render(){
        return(
            <div>
                <progress value={this.state.uploadValue} max="100"></progress>
                <input type="file"  onChange={this.handleUpload}/>
                <img width="320" src={this.state.picture} alt="Imagen"/>
            </div>
        )
    }
}

export default FileUpload ;
