import React, { Component } from 'react';


class FileUpload extends Component {
    constructor(){
        super();
        this.state = {
            uploadValue: 0
        };

    }
    //Primero defino el archivo a subir luego la referencia de donde en el storage y lo subo con put
    

    render(){
        return(
            <div>
                <progress value={this.state.uploadValue} max="100"></progress>
                <input type="file"  onChange={this.props.onUpload}/>
                <img width="320" src={this.state.picture} alt="Imagen"/>
            </div>
        )
    }
}

export default FileUpload ;
