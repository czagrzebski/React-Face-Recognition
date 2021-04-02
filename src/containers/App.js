import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import Rank from '../components/Rank/Rank';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';

const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      }
    },
  },
};


const initalState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: 
        {
          id: '',
          name: '',
          email: '',
          password: '',
          entries: 0,
          joined: ''
      } 
  }

class App extends Component {
  constructor() {
    super();
    this.state = initalState;
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}, this.getFaceBoundary); //async call back for api call (allows access to modified state)
  }

  getFaceBoundary = () => {
    fetch('https://boiling-inlet-24719.herokuapp.com/detection', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
         imageURL: this.state.imageUrl
      })
    })
      .then(response => response.json())
      .then((boundary) => this.calculateFaceLocation(boundary))
      .then((box) => {
        this.displayFaceBox(box);
        this.incrementImageCount();
      })
      .catch(err => console.log) 
  }

  incrementImageCount = () => {
    fetch('https://boiling-inlet-24719.herokuapp.com/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
         id: this.state.user.id
      })
    })
      .then(response => response.json())
      .then(count => { this.setState(Object.assign(this.state.user, { entries: count} ));
      })
      .catch(err => console.log);
  }

  calculateFaceLocation = (response) => {
    const clarifaiFace = response;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - ((clarifaiFace.bottom_row * height))
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initalState);
    }else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})

  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles"
                  params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home' 
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} rank={this.state.user.entries}/>
            <ImageLinkForm userID={this.userID} onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          
          :(
            this.state.route === 'signin' ? 
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    );
  }
}

export default App;
