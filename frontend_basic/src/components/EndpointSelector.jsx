import React from 'react';

function EndpointSelector({ onEndpointChange }) {
    const endpoints = [
        { value: 'createIdentity', label: 'Create Identity', method: 'POST' },
        { value: 'isValid', label: 'Is Valid', method: 'GET' },
        { value: 'updateIdentity', label: 'Update Identity', method: 'PUT' },
        { value: 'revokeIdentity', label: 'Revoke Identity', method: 'POST' },
    ];

    const handleChange = (event) => {
        onEndpointChange(event.target.value);
    };

    return (
        <div className="endpoint-selector">
            <label htmlFor="endpoint">Select API Endpoint:</label>
            <select id="endpoint" onChange={handleChange}>
                <option value="">-- Select an endpoint --</option>
                {endpoints.map((endpoint) => (
                    <option key={endpoint.value} value={endpoint.value}>
                        {endpoint.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default EndpointSelector;
