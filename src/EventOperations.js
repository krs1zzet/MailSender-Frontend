import React, { useEffect, useState } from 'react';
import apiUtils from './utils/apiUtils';

const EventOperations = () => {
    const [eventData, setEventData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await apiUtils.fetchApi('receivers/1');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Handle empty response
                const data = response.status !== 204 ? await response.json() : [];
                setEventData(data);
            } catch (error) {
                console.error('Error fetching event data:', error);
                setError(error);
            }
        };

        fetchEventData();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Event Data</h1>
            {eventData.length === 0 ? (
                <p>No event data available.</p>
            ) : (
                <ul>
                    {eventData.map(item => (
                        <li key={item.id}>{item.fname} {item.lname} - {item.email}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventOperations; 