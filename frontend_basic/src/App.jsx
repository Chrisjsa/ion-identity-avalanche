import React, { useState } from 'react';
import EndpointSelector from './components/EndpointSelector';
import DynamicForm from './components/DynamicForm';
import ResponseDisplay from './components/ResponseDisplay';
import './App.css';

function App() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleEndpointChange = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setApiResponse(null); // Clear previous response when endpoint changes
  };

  const handleApiResponse = (response) => {
    setApiResponse(response);
  };

  return (
      <div className="app-container">
        <h1>Welcome to Ion Identity Project</h1>
        <EndpointSelector onEndpointChange={handleEndpointChange} />
        {selectedEndpoint && (
            <DynamicForm endpoint={selectedEndpoint} onApiResponse={handleApiResponse} />
        )}
        <ResponseDisplay response={apiResponse} />
      </div>
  );
}

export default App;
