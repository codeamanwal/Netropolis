import React, { useState } from 'react';

function Application() {
    const [name, setName] = useState('');
    const [values, setValues] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (name.trim() && values.trim()) {
            // Assuming you would send the data to a backend server for further processing
            // In this example, we'll just log the data to the console
            console.log("Applicant:", { name, values });
            setStatusMessage("Application submitted successfully!");
            setName('');
            setValues('');
        } else {
            setStatusMessage("Please fill in all fields.");
        }
    };

    return (
        <div>
            <h1>Rural Work Experience Program Application</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label><br />
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                /><br /><br />

                <label htmlFor="values">Values (e.g., community-oriented, environmentally-conscious, entrepreneurial):</label><br />
                <input
                    type="text"
                    id="values"
                    name="values"
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                /><br /><br />

                <button type="submit">Apply</button>
            </form>

            <div>{statusMessage}</div>
        </div>
    );
}

export default Application;
