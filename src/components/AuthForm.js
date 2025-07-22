import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import apiUtils from '../utils/apiUtils';
import './AuthForm.css';

const AuthForm = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const endpoint = isRegistering ? 'auth/sign-up' : 'auth/sign-in';
        const payload = isRegistering
            ? { email, password, fullName, purpose: 'CREATE' }
            : { email, password };

        try {
            const response = await apiUtils.fetchApi(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed. Please check your credentials.');
            }

            if (!isRegistering) {
                const userInfo = {
                    id: data.userId || data.id,
                    email: email,
                    fullName: data.fullName || data.name || email.split('@')[0],
                };
                login(data.token, userInfo);
                if (onSuccess) onSuccess();
                navigate('/create-event');
            } else {
                setIsRegistering(false);
                setError('Registration successful! Please login.');
                setFullName('');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="auth-container d-flex align-items-center justify-content-center">
            <Card className="auth-card shadow-lg">
                <Card.Body className="p-5">
                    <h2 className="text-center mb-4">
                        {isRegistering ? 'Hesap Oluştur' : 'Tekrar Hoşgeldiniz'}
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
                                        placeholder="Ad Soyad"
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
                                    placeholder="E-posta Adresi"
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
                                    placeholder="Şifre"
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
                            {isLoading ? 'Lütfen bekleyin...' : (isRegistering ? 'Kayıt Ol' : 'Giriş Yap')}
                        </Button>

                        <div className="text-center">
                            <Button
                                variant="link"
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setError('');
                                    setEmail('');
                                    setPassword('');
                                    setFullName('');
                                }}
                                className="text-decoration-none"
                            >
                                {isRegistering
                                    ? 'Zaten hesabınız var mı? Giriş Yap'
                                    : 'Hesabınız yok mu? Kayıt Olun'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AuthForm;
