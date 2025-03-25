import React from 'react';

function ResponseDisplay({ response }) {
    return (
        <div className="response-display">
            {response && (
                <>
                    <h2>API Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </>
            )}
        </div>
    );
}

export default ResponseDisplay;
