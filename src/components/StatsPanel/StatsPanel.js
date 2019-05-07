import React from "react";

const StatsPanel = ({ statsReady, loading, totalTrips, totalMiles, totalUnits, dateStartFormatted, dateEndFormatted }) => {
    if (statsReady) {
        return (
            <div>
                <h4>{dateStartFormatted} to {dateEndFormatted}</h4><br></br>
                <h4><strong>Total trips: <br></br></strong>{totalTrips}</h4>
                <h4><strong>Total miles: <br></br></strong>{totalMiles}</h4>
                <h4><strong>Total unique units: <br></br></strong>{totalUnits}</h4>
                <br></br>
            </div>
        )
    } else if (loading) {
        return (
            <div>
                <h4>Loading statistics for date range<br></br>{dateStartFormatted} to {dateEndFormatted}.</h4>
                <img src="loading.gif" alt="loading wheel"></img>
                <br></br>
            </div>
        )
    } else {
        return (
            <div>
                <h4>
                    Select a date or range for data.
                </h4>
                <br></br>
            </div>            
        )
    }
}

export default StatsPanel;