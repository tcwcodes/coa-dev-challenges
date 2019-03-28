import React, { Component } from "react";
import "./App.css";

import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // Here is a link to the API Documentation: https://dev.socrata.com/
    axios
      .get("https://data.austintexas.gov/resource/7d8e-dm7r.json")
      .then(res => {
        console.log(res);
        // TODO: Decided how to store the response data.
      });
  }

  render() {
    return (
      <div className="App">
        <h2>Dockless Scooters</h2>

        <p className="App-intro">
          {/* TODO: Delete line below */}
          Open Dev Tools Console to see data.
          {/* TODO: Display data here, maybe? Be creative! 🎉 */}
        </p>
      </div>
    );
  }
}

export default App;
