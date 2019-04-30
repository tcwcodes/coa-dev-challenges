import React, { Component } from "react";
import Calendar from 'react-calendar';
import StatsPanel from "./components/StatsPanel";
import "./App.css";

import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateStart: "",
      dateEnd: "",
      dateStartFormatted: "",
      dateEndFormatted: "",
      stats: {},
      loading: false,
      submitted: false
    };
    this.selectStartDate = this.selectStartDate.bind(this);
    this.selectEndDate = this.selectEndDate.bind(this);
    this.convertDate = this.convertDate.bind(this);
    this.queryPortal = this.queryPortal.bind(this);
    this.calculateTotalMiles = this.calculateTotalMiles.bind(this);
    this.calculateTotalUnits = this.calculateTotalUnits.bind(this);
    this.reloadPanel = this.reloadPanel.bind(this);
  }

  componentDidMount() {

  }

  reloadPanel() {
    this.setState({
      dateStart: "",
      dateEnd: "",
      dateStartFormatted: "",
      dateEndFormatted: "",
      stats: {},
      loading: false,
      submitted: false
    })
  }

  selectStartDate(event) {
    let dateType = "dateStart";
    this.convertDate(event, dateType);
  }

  selectEndDate(event) {
    let dateType = "dateEnd";
    this.convertDate(event, dateType);
  }

  // Convert the dates from the calendar to SODA format and then set state for the respective dates
  convertDate(event, dateType) {
    let year = event.getYear() + 1900;
    let month = event.getMonth() + 1;
    let day = event.getDate();
    let dateConverted = "";
    let dateFormatted = "";
    // Ensure single-digit months and dates fit the SODA format requirements
    if (month < 10 && day < 10) {
      month = "0" + month;
      day = "0" + day
    } else if (month < 10 && day > 9) {
      month = "0" + month
    } else if (month > 9 && day < 10) {
      day = "0" + day      
    } else {}
    // Ensure that the start date starts at midnight and the end date ends just before midnight to capture all trips
    if (dateType === "dateStart") {
      dateConverted = year + '-' + month + "-" + day + "T00:00:00.000"
    } else {
      dateConverted = year + '-' + month + "-" + day + "T23:59:59.999"
    }
    dateFormatted = month + '-' + day + "-" + year;
    this.setState({
      [dateType] : dateConverted,
      [dateType + "Formatted"] : dateFormatted,
      submitted : false
    });
  }

  calculateTotalMiles(data) {
    let sum = 0;
    let totalMiles;
    let totalMilesRounded;
    data.forEach(element => {
      sum += parseInt(element.trip_distance)
    });
    totalMiles = sum * .000621371
    totalMilesRounded = Math.round(totalMiles)
    return totalMilesRounded;
  }

  calculateTotalUnits(data) {
    let unitsArray = [];
    data.forEach(element => {
      if (unitsArray.includes(element.device_id)) {
      } else {
        unitsArray.push(element.device_id);
      };
    });
    return unitsArray.length;
  }

  queryPortal() {
    // Here is a link to the API Documentation: https://dev.socrata.com/
    let baseURL = "https://data.austintexas.gov/resource/7d8e-dm7r.json?$limit=1000000&"
    let appToken = "OKLYqKegeOGOIG08OM1K7EEHV"
    // The start and end dates the user puts in for the query range
    let dateRangeStart = this.state.dateStart
    let dateRangeEnd = this.state.dateEnd
    // Make it so user chooses two dates in the proper order (or the same dates)
    // To do: Hide or deactivate button until correct dates are chosen
    if (!dateRangeStart || !dateRangeEnd) {
      // console.log("Please select starting and ending dates (even if they are the same).")
    } else if (dateRangeStart > dateRangeEnd) {
      this.setState({
        submitted: false,
        loading: false
      });
    } else {
      this.setState({
        submitted: true,
        loading: true
      });
      // Filter to include only trips that started AND ended in the specified query range
      let tripStartTimeRange = "start_time between '" + dateRangeStart + "' and '" + dateRangeEnd
      let tripEndTimeRange = "end_time between '" + dateRangeStart + "' and '" + dateRangeEnd
      let queryURL = "$where=" + tripStartTimeRange + "' AND " + tripEndTimeRange + "'"
      // console.log(baseURL + queryURL);
      // Query the Open Data Portal
      axios({
        method: 'get',
        url: baseURL + queryURL,
        headers: {
          'X-App-Token' : appToken,
        }
      })
      .then(res => {
        // Run calculations and store desired outputs into a new object
        let statsOutput = {
          totalTrips: res.data.length,
          totalMiles: this.calculateTotalMiles(res.data),
          totalUnits: this.calculateTotalUnits(res.data)
        };
        this.setState({
          stats: statsOutput,
          loading: false
        });
        // console.log(this.state);
      });
    }
  }

  render() {

    const statsReady = this.state.stats.totalTrips;
    const loading = this.state.loading;
    const submitted = this.state.submitted;
    let statsPanelDisplay;
    let submitReloadButton;
    let calendarDisplay;
    if (statsReady && loading === false && submitted === true) {
      statsPanelDisplay =
      <StatsPanel
        stats={this.state.stats}
        dateStartFormatted={this.state.dateStartFormatted}
        dateEndFormatted={this.state.dateEndFormatted}
      />
      submitReloadButton =
      <button
        className="btn btn-primary"
        type="submit"
        onClick={this.reloadPanel}>
        Reload
      </button>
    } else if (loading === true) {
      statsPanelDisplay = <div><h4>Loading statistics for date range<br></br>{this.state.dateStartFormatted} and {this.state.dateEndFormatted}.</h4>
      <img src="loading.gif" alt="loading wheel"></img></div>
      submitReloadButton =
      <button
        className="btn btn-primary"
        type="submit"
        onClick={this.reloadPanel}>
        Cancel
      </button>   
    } else {
      statsPanelDisplay = 
      <h4>
        Select start and end dates to see statistics.
      </h4>
      submitReloadButton =
      <button
        className="btn btn-primary"
        type="submit"
        onClick={this.queryPortal}>
        Submit
      </button>
      calendarDisplay =
      <div className="row">
        <div className="col-md-6">
          <div className="Calendar">
            <h4>Start date</h4>
            <Calendar
              onChange={this.selectStartDate}
            />
          </div>
          <br></br>
        </div>
        <div className="col-md-6">
          <div className="Calendar">
            <h4>End date</h4>
            <Calendar
              onChange={this.selectEndDate}
            />
          </div>
          <br></br>
        </div>
      </div>
    }

    return (
      <div className="App">

        <div>
          <h1>Dockless Mobility Usage</h1>
          <br></br>
        </div>

        <div>
          {statsPanelDisplay}
          <br></br>
        </div>

        {calendarDisplay}


        <div>
          {submitReloadButton}
        </div>
        <br></br>

      </div>
    );
  }
}

export default App;
