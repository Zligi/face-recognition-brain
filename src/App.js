import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

// particles
import ParticleS from "./particleS";
// particles

const returnClarifaiRequestOptions = imageUrl => {
  const PAT = "fcf5972eaece432e9826514b12a7b5a0";

  const USER_ID = "igi";
  const APP_ID = "test2";

  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": "Key " + PAT
    },
    body: raw
  };
  return requestOptions;
};

function App() {
  const [state, setState] = useState({
    input: "",
    imageUrl: ""
  });
  const [box, setBox] = useState({
    box: {}
  });
  const [rautState, setRautState] = useState({ route: "signin" });
  const [signUpState, setSignUpState] = useState({ isSignedIn: false });

  const calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  const displayFacebox = box => {
    setBox({
      box: box
    });
  };

  const onInputChange = event => {
    console.log("input console:", event.target.value);
    setState({
      ...state,
      input: event.target.value
    });
    // setInput((event.target.value = input));
  };

  const onButtonSubmit = () => {
    setState({
      ...state,
      imageUrl: state.input
    });
    // console.log(returnClarifaiRequestOptions(state.input));
    // console.log(state.input);
    fetch(
      "https://api.clarifai.com/v2/models/" +
        "face-detection" +
        "/versions/" +
        "6dc7e46bc9124c5c8824be4822abe105" +
        "/outputs",
      returnClarifaiRequestOptions(state.input)
    )
      .then(response => response.json())
      .then(result => calculateFaceLocation(result))
      .then(result => displayFacebox(result))
      .catch(error => console.log("error", error));
  };

  const onRouteChange = route => {
    if (route === "signout") {
      setSignUpState({
        isSignedIn: false
      });
    } else if (route === "home") {
      setSignUpState({
        isSignedIn: true
      });
    }
    setRautState({
      route: route
    });
  };

  return (
    <div className='App'>
      {/* <Particles className="particles" params={particleOptions} /> */}
      <ParticleS />
      <Navigation
        isSignedIn={signUpState.isSignedIn}
        onRouteChange={onRouteChange}
      />
      {rautState.route === "home" ? (
        <>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box.box} imageUrl={state.imageUrl} />
        </>
      ) : rautState.route === "signin" ? (
        <Signin onRouteChange={onRouteChange} />
      ) : (
        <Register onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
