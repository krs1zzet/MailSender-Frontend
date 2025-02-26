import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import './AuthForm.css';

const AuthForm = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const url = isRegistering ? 'http://localhost:8080/api/auth/sign-up' : 'http://localhost:8080/api/auth/sign-in';
        const payload = isRegistering
            ? { email, password, fullName, purpose: 'CREATE' }
            : { email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Authentication failed. Please check your credentials.');
            }

            const data = await response.json();

            if (!isRegistering) {
                localStorage.setItem('token', data.token);
                onAuthSuccess();
            } else {
                setIsRegistering(false);
                setError('Registration successful! Please login.');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center min-vh-100">
            <Card className="auth-card shadow-lg">
                <Card.Body className="p-5">
                    <h2 className="text-center mb-4">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    
                    {error && (
                        <Alert variant={error.includes('successful') ? 'success' : 'danger'}>
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        {isRegistering && (
                            <Form.Group className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaUser className="icon" />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaEnvelope className="icon" />
                                </span>
                                <Form.Control
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaLock className="icon" />
                                </span>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
                        </Button>

                        <div className="text-center">
                            <Button
                                variant="link"
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setError('');
                                }}
                                className="text-decoration-none"
                            >
                                {isRegistering
                                    ? 'Already have an account? Login'
                                    : "Don't have an account? Register"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AuthForm; 