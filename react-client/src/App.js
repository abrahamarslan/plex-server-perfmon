import React from 'react';
import logo from './logo.svg';
import './App.css';
import socket from "./utilities/socket";
import {render} from "react-dom";
import Widget from "./Widget";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      perfData: {}
    }
  }
  componentDidMount() {
    console.log('executing');
    socket.on('data', (data) => {
      // Update app state when we get new data and re-render widgets
      // Make a copy of current state
      const currentState = ({...this.state.perfData});
      // Start an array with mac-address as key value (Unique Identifier for each machine)
      currentState[data.macAddress] = data;
      this.setState({
        perfData: currentState
      })
    })
  }

  render() {
    let widgets = [];
    const data = this.state.perfData;
    // Grab each machine's data object and convert it into an array using Object.entries
    Object.entries(data).forEach(([key, value]) => {
      widgets.push(<Widget key={key} data={value} />);
    });
    return (
        <div className="App">
          {widgets}
        </div>
    );
  }
}

export default App;
