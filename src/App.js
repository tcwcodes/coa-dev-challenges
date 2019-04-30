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
      today: new Date(),
      stats: {},
      loading: false,
    };
    this.selectDateRange = this.selectDateRange.bind(this);
    this.convertDate = this.convertDate.bind(this);
    this.queryPortal = this.queryPortal.bind(this);
    this.calculateStats = this.calculateStats.bind(this);
    this.calculateTotalMiles = this.calculateTotalMiles.bind(this);
    this.calculateTotalUnits = this.calculateTotalUnits.bind(this);
    this.reloadPanel = this.reloadPanel.bind(this);
  }

  componentDidMount() {

  }

  //Determine whether use has selected a range or a single date, then pass to converDate function
  selectDateRange(event) {
    //If there are two objects, user has selected a range
    if (event[1]) {
      let startDate = event[0];
      let endDate = event[1];
      this.convertDate(startDate, "dateStart");
      this.convertDate(endDate, "dateEnd");
    // If there is only one object, user selected a single date
    } else {
      this.convertDate(event, "dateStart");
      this.convertDate(event, "dateEnd");
    };
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
    // Set state with convert and formatted dates
    this.setState({
      [dateType] : dateConverted,
      [dateType + "Formatted"] : dateFormatted,
    });
  }

  queryPortal() {
    // Here is a link to the API Documentation: https://dev.socrata.com/
    let baseURL = "https://data.austintexas.gov/resource/7d8e-dm7r.json?$limit=1000000&"
    let appToken = "OKLYqKegeOGOIG08OM1K7EEHV"
    let dateRangeStart = this.state.dateStart
    let dateRangeEnd = this.state.dateEnd
    this.setState({
      loading: true
    });
    // Filter to include only trips that started AND ended in the specified query range
    let tripStartTimeRange = "start_time between '" + dateRangeStart + "' and '" + dateRangeEnd
    let tripEndTimeRange = "end_time between '" + dateRangeStart + "' and '" + dateRangeEnd
    let queryURL = "$where=" + tripStartTimeRange + "' AND " + tripEndTimeRange + "'"
    // Query the Open Data Portal
    axios({
      method: 'get',
      url: baseURL + queryURL,
      headers: {
        'X-App-Token' : appToken,
      }
    })
    .then(res => {
      this.calculateStats(res.data);
    });
  }

  // Run calculations and store desired outputs into a new object
  calculateStats(data) {
    let statsOutput = {
      totalTrips: data.length,
      totalMiles: this.calculateTotalMiles(data),
      totalUnits: this.calculateTotalUnits(data)
    };
    this.setState({
      stats: statsOutput,
      loading: false
    });
    console.log(this.state);
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

  reloadPanel() {
    this.setState({
      dateStart: "",
      dateEnd: "",
      dateStartFormatted: "",
      dateEndFormatted: "",
      today: new Date(),
      stats: {},
      loading: false,
    })
  }

  render() {

    const statsReady = this.state.stats.totalTrips;
    const loading = this.state.loading;
    let statsPanelDisplay;
    let submitReloadButton;
    let calendarDisplay;
    if (statsReady) {
      statsPanelDisplay =
      <div>
        <StatsPanel
          stats={this.state.stats}
          dateStartFormatted={this.state.dateStartFormatted}
          dateEndFormatted={this.state.dateEndFormatted}
        />
        <br></br>
      </div>
      submitReloadButton =
      <div>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={this.reloadPanel}>
          Reload
        </button>
        <br></br>
      </div>
    } else if (loading === true) {
      statsPanelDisplay =
      <div>
        <h4>Loading statistics for date range<br></br>{this.state.dateStartFormatted} and {this.state.dateEndFormatted}.</h4>
        <img src="loading.gif" alt="loading wheel"></img>
        <br></br>
      </div>
      submitReloadButton = ""
    } else {
      statsPanelDisplay = 
      <div>
        <h4>
          Select start and end dates to see statistics.
        </h4>
        <br></br>
      </div>
      submitReloadButton =
      <div>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={this.queryPortal}>
          Submit
        </button>
        <br></br>
      </div>
      calendarDisplay =
      <div className="Calendar">
        <Calendar
          onChange={this.selectDateRange}
          onClickDay={this.selectDateRange}
          maxDate={this.state.today}
          selectRange={true}
        />
        <br></br>
      </div>
    }

    return (
      <div className="App">

        <div>
          <br></br>
          <h1>Dockless Mobility Usage</h1>
          <br></br>
        </div>

        {statsPanelDisplay}

        {calendarDisplay}

        {submitReloadButton}

      </div>
    );
  }
}

export default App;
