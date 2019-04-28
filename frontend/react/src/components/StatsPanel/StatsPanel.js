import React from "react";

const StatsPanel = ( {stats, dateStartFormatted, dateEndFormatted} ) => (
    <div>
        <h2>Statistics</h2>
        <h4>{dateStartFormatted} to {dateEndFormatted}</h4>
        <h4><strong>Total trips: </strong>{stats.totalTrips}</h4>
        <h4><strong>Total miles: </strong>{stats.totalMiles}</h4>
        <h4><strong>Total unique units: </strong>{stats.totalUnits}</h4>
    </div>
)



export default StatsPanel;