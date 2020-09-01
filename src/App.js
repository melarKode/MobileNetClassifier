import * as tf from '@tensorflow/tfjs';
import React,{useReducer, useState} from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './App.css';

const stateMachine = {
  initial: 'initial',
  states:{
    initial: {on: {next:'loadingModel'}},
    loadingModel: {on: {next:'awaitingUpload'}},
    awaitingUpload: {on: {next:'ready'}},
    ready: {on: {next:'classifying'}, showImage: true},
    classifying: {on:{next:'complete'}},
    complete: {on: {next:'awaitingUpload'}, showImage: true}
  } 
}

const reducer = (currentState,event)=> stateMachine.states[currentState].on[event] || stateMachine.initial;

function App() {
  tf.setBackend("cpu");
  const [state, dispatch] = useReducer(reducer, stateMachine.initial);
  const [model, setModel] = useState(null);
  const next = ()=> dispatch('next');

  const loadModel = async ()=>{
    console.log('hi')
    next();
    const mobilenetModel = await mobilenet.load();
    setModel(mobilenetModel);
    next();
  }

  const buttonProps = {
    initial: {text: 'Load Model',action:loadModel},
    loadingModel: {text: 'Loading Model...', action: ()=>{}},
    awaitingUpload: {text: 'Upload Photo',action: ()=>{}},
    ready: {text: 'Identify', action: ()=>{}},
    classifying: {text: 'Identifying', action: ()=>{}},
    complete: {text: 'Reset', action: ()=>{}},
  }
  return (
    <div className="App">
      <button onClick={buttonProps[state].action}>{buttonProps[state].text}</button>
    </div>
  );
}

export default App;
