import React from 'react';

const SubmitReloadButton = ({ statsReady, loading, datesChosen, reloadPanel, buildQuery }) => {
    if (datesChosen && !loading) {
        return (
            <div>
                <button
                className="btn btn-primary"
                type="submit"
                onClick={buildQuery}>
                Submit
                </button>
                <br></br>
            </div>
        )
    } else if (statsReady) {
        return (
            <div>
                <button
                className="btn btn-primary"
                type="submit"
                onClick={reloadPanel}>
                Reload
                </button>
                <br></br>
            </div>
        )
    } else {
        return null
    }
}

export default SubmitReloadButton;