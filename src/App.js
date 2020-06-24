import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Clarifai from 'clarifai'


const app = new Clarifai.App({
 apiKey: 'e872c48fd0fa4d80b151233217f44450'
});

const particlesOptions ={
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component{
  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  calculateFaceLocation =(data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.querySelector('#inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    // console.log(width, height)
    return {
      leftCol: clarifaiFace.left_col  * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box) =>{
    console.log(box)
    this.setState({ box: box})
  }
  
  onInputChange = (event) =>{
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    (response) => this.displayFaceBox(this.calculateFaceLocation(response))
      //console.log(response.outputs[0].data.regions[0].region_info.bounding_box),
    .catch(err => console.log(err))
  );
  }

    render() {
      return(
      <div className="App">
          <Particles className ='particles' params={particlesOptions} />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange = {this.onInputChange} 
            onButtonSubmit = {this.onSubmit} 
          />
          <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl}/>
        </div>
      );
    }
}

export default App;
