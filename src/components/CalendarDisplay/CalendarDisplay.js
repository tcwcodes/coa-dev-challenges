import React from 'react';
import Calendar from 'react-calendar';

const CalendarDisplay = ({ statsReady, loading, today, selectDateRange }) => {
    if (!loading && !statsReady) {
        return (
            <div className="Calendar">
                <Calendar
                onChange={selectDateRange}
                onClickDay={selectDateRange}
                maxDate={today}
                selectRange={true}
                />
                <br></br>
            </div>
        )
    } else {
        return null
    }
}

export default CalendarDisplay;