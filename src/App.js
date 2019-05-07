import React, { Component } from "react";
import StatsPanel from "./components/StatsPanel";
import SubmitReloadButton from "./components/SubmitReloadButton";
import ModeSelector from "./components/ModeSelector";
import CalendarDisplay from "./components/CalendarDisplay";
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
      vehicleType: " is not null",
      today: new Date(),
      totalTrips: "",
      totalMiles: "",
      totalUnits: "",
      loading: false,
    };
    this.selectDateRange = this.selectDateRange.bind(this);
    this.convertDate = this.convertDate.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
    this.queryTrips = this.queryTrips.bind(this);
    this.queryMiles = this.queryMiles.bind(this);
    this.queryUnits = this.queryUnits.bind(this);
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

  selectMode(event) {
    this.setState({vehicleType: event.target.value});
  }

  buildQuery() {
    let baseURL = "https://data.austintexas.gov/resource/7d8e-dm7r.json?$limit=100000000&"
    let appToken = "OKLYqKegeOGOIG08OM1K7EEHV"
    let dateRangeStart = this.state.dateStart
    let dateRangeEnd = this.state.dateEnd
    let vehicleType = this.state.vehicleType
    const minDistance = 160.934
    const maxDistance = 804672
    const minDuration = 0
    const maxDuraction = 86400
    // Filter to include only trips in the specified query range
    let tripStartTimeRange = "start_time between '" + dateRangeStart + "' and '" + dateRangeEnd
    let distanceRange = "trip_distance between " + minDistance + " and " + maxDistance
    let durationRange = "trip_duration between " + minDuration + " and " + maxDuraction
    let vehicleSelection = "vehicle_type" + vehicleType
    let queryURL = "$where=" + tripStartTimeRange + "' AND " + distanceRange + " AND " + durationRange + " AND " + vehicleSelection
    this.setState({
      loading: true
    });
    this.queryTrips(baseURL, queryURL, appToken);
    this.queryMiles(baseURL, queryURL, appToken);
    this.queryUnits(baseURL, tripStartTimeRange, vehicleSelection, appToken);
  }

  queryTrips(baseURL, queryURL, appToken) {
    let tripsQuery = "&$select=count(trip_id)";
    // Query the Open Data Portal
    axios({
      method: 'get',
      url: baseURL + queryURL + tripsQuery,
      headers: {
        'X-App-Token' : appToken,
      }
    })
    .then(res => {
      let queryTotalTrips = parseInt(res.data[0].count_trip_id).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      this.setState({ totalTrips: queryTotalTrips});
    });  
  }

  queryMiles(baseURL, queryURL, appToken) {
    let milesQuery = "&$select=sum(trip_distance)";
    // Query the Open Data Portal
    axios({
      method: 'get',
      url: baseURL + queryURL + milesQuery,
      headers: {
        'X-App-Token' : appToken,
      }
    })
    .then(res => {
      let queryTotalMiles = Math.round(res.data[0].sum_trip_distance * 0.000621371).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      this.setState({ totalMiles: queryTotalMiles});
    });
  }

  queryUnits(baseURL, tripStartTimeRange, vehicleSelection, appToken) {
    let queryURL = "$where=" + tripStartTimeRange + "' AND " + vehicleSelection
    let unitsQuery = "&$select=distinct(device_id)";
    // Query the Open Data Portal
    axios({
      method: 'get',
      url: baseURL + queryURL + unitsQuery,
      headers: {
        'X-App-Token' : appToken,
      }
    })
    .then(res => {
      let queryTotalUnits = res.data.length.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      this.setState({ totalUnits: queryTotalUnits})
    });
  }

  reloadPanel() {
    this.setState({
      dateStart: "",
      dateEnd: "",
      dateStartFormatted: "",
      dateEndFormatted: "",
      vehicleType: " is not null",
      today: new Date(),
      totalTrips: "",
      totalMiles: "",
      totalUnits: "",
      loading: false,
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <br></br>
          <h1>Dockless Mobility Usage</h1>
          <br></br>
        </div>
        <StatsPanel
          statsReady={this.state.totalTrips && this.state.totalMiles && this.state.totalUnits}
          loading={this.state.loading}
          totalTrips={this.state.totalTrips}
          totalMiles={this.state.totalMiles}
          totalUnits={this.state.totalUnits}
          dateStartFormatted={this.state.dateStartFormatted}
          dateEndFormatted={this.state.dateEndFormatted}
        />
        <CalendarDisplay
          statsReady={this.state.totalTrips && this.state.totalMiles && this.state.totalUnits}
          loading={this.state.loading}
          today={this.state.today}
          selectDateRange={this.selectDateRange}
        />
        <ModeSelector
          statsReady={this.state.totalTrips && this.state.totalMiles && this.state.totalUnits}
          loading={this.state.loading}
          datesChosen={this.state.dateStart && this.state.dateEnd}
          vehicleType={this.state.vehicleType}
          selectMode={this.selectMode}
        />
        <SubmitReloadButton
          statsReady={this.state.totalTrips && this.state.totalMiles && this.state.totalUnits}
          loading={this.state.loading}
          datesChosen={this.state.dateStart && this.state.dateEnd}
          reloadPanel={this.reloadPanel}
          buildQuery={this.buildQuery}
        />
      </div>
    );
  }
}

export default App;
