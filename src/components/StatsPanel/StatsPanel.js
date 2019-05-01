import React from "react";

const StatsPanel = ( {totalTrips, totalMiles, totalUnits, dateStartFormatted, dateEndFormatted} ) => (
    <div className="Stats-panel">
        <h4>{dateStartFormatted} to {dateEndFormatted}</h4><br></br>
        <h4><strong>Total trips: </strong>{totalTrips}</h4>
        <h4><strong>Total miles: </strong>{totalMiles}</h4>
        <h4><strong>Total unique units: </strong>{totalUnits}</h4>
    </div>
)



export default StatsPanel;