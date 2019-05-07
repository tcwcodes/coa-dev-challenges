import React from 'react';

const ModeSelector = ({ statsReady, loading, datesChosen, vehicleType, selectMode }) => {
    if (datesChosen && !statsReady && !loading) {
        return (
            <div className="row">
            <div className="col-md-4"></div>
                <div className="form-group col-md-4">
                        <select className="form-control" value={vehicleType} onChange={selectMode}>
                            <option value=" is not null">Select mode (optional)</option>
                            <option value="='scooter'">Scooter</option>
                            <option value="='bicycle'">Bicycle</option>
                        </select>
                </div>
            <div className="col-md-4"></div>
          </div>
        )
    } else {
        return null
    }
}

export default ModeSelector;