import React from "react";

const StatsPanel = ( {totalTrips, totalMiles, totalUnits, dateStartFormatted, dateEndFormatted} ) => (
    <div className="Stats-panel">
        <h4>{dateStartFormatted} to {dateEndFormatted}</h4><br></br>
        <h4><strong>Total trips: <br></br></strong>{totalTrips}</h4>
        <h4><strong>Total miles: <br></br></strong>{totalMiles}</h4>
        <h4><strong>Total unique units: <br></br></strong>{totalUnits}</h4>
    </div>
)



export default StatsPanel;