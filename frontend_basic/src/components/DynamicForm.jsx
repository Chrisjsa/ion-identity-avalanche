import React, { useState } from 'react';

function DynamicForm({ endpoint, onApiResponse }) {
    const [formData, setFormData] = useState({});


    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Implement API call based on the selected endpoint
        let apiUrl = `http://0.0.0.0:8000/${endpoint}`;  // Adjust the API URL as needed
        let method = 'GET';
        let headers = {
            'Content-Type': 'application/json',
        };
        let body = null;

        if (endpoint === 'createIdentity' || endpoint === 'updateIdentity' || endpoint === 'revokeIdentity') {
            method = 'POST';
            body = JSON.stringify(formData);
        }

        if (endpoint === 'updateIdentity') {
            method = 'PUT'; // Use PUT for updateIdentity
        }

        if (endpoint === 'isValid') {
            apiUrl = `http://0.0.0.0:8000/isValid/${formData.address}`;
            method = 'GET';
        }


        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: headers,
                body: body,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onApiResponse(data);
        } catch (error) {
            onApiResponse({ error: error.message });
        }
    };

    const renderFormFields = () => {
        switch (endpoint) {
            case 'createIdentity':
                return (
                    <>
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                        <input type="password" name="privateKey" placeholder="Private Key" onChange={handleChange} />
                    </>
                );
            case 'isValid':
                return (
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} />
                );
            case 'updateIdentity':
                return (
                    <>
                        <input type="text" name="name" placeholder="New Name" onChange={handleChange} />
                        <input type="email" name="email" placeholder="New Email" onChange={handleChange} />
                        <input type="password" name="privateKey" placeholder="Private Key" onChange={handleChange} />
                    </>
                );
            case 'revokeIdentity':
                return (
                    <input type="password" name="privateKey" placeholder="Private Key" onChange={handleChange} />
                );
            default:
                return null;
        }
    };

    return (
        <form className="dynamic-form" onSubmit={handleSubmit}>
            {renderFormFields()}
            {endpoint && <button type="submit">Submit</button>}
        </form>
    );
}

export default DynamicForm;
