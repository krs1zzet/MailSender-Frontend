const express = require('express');
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

async function registerUser(email, password, fullName) {
    const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            fullName,
            purpose: 'CREATE',
        }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    const data = await response.json();
    console.log('Registration successful:', data);
}

app.get('/api/events', (req, res) => {
    // Your existing code to handle the request
});

app.post('/api/login', (req, res) => {
    // Simulate login logic
    const { email, password } = req.body;
    if (email && password) {
        res.json({
            token: 'your-jwt-token',
            user: {
                id: 1,
                username: email,
                fullName: 'John Doe',
                imageUrl: null,
                createdAt: new Date().toISOString(),
            },
        });
    } else {
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
}); 