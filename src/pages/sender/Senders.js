import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiUtils from '../../utils/apiUtils';

const Senders = () => {
    const [senders, setSenders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSender, setCurrentSender] = useState({ 
        email: '', 
        password: '',
        id: null 
    });
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const { eventId } = useParams();
    const navigate = useNavigate();

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false }), 5000);
    };
    
    const fetchSenders = async () => {
        try {
            const response = await apiUtils.fetchApi(`senders/${eventId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const textData = await response.text();
            const data = textData === "" ? [] : JSON.parse(textData);
            setSenders(data);
        } catch (error) {
            console.error('Error fetching senders:', error);
            showAlert('danger', 'Failed to fetch senders. Please ensure the backend server is running.');
        }
    };

    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            const parsedEvent = JSON.parse(storedEvent);
            if (parsedEvent.id.toString() === eventId) {
                fetchSenders();
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [eventId, navigate]);

    const handleClose = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentSender({ 
            email: '', 
            password: '',
            id: null 
        });
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (sender) => {
        setCurrentSender({
            id: sender.id || null,
            email: sender.email || '',
            password: '' // Don't show existing password
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = editMode 
                ? `senders/${currentSender.id}`
                : 'senders';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const senderData = {
                email: currentSender.email,
                password: currentSender.password,
                eventId: parseInt(eventId)
            };
            
            const response = await apiUtils.fetchApi(endpoint, {
                method: method,
                body: JSON.stringify(senderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            showAlert('success', `Sender ${editMode ? 'updated' : 'created'} successfully!`);
            await fetchSenders();
            handleClose();
        } catch (error) {
            console.error('Error saving sender:', error);
            showAlert('danger', `Failed to save sender: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sender?')) {
            try {
                const response = await apiUtils.fetchApi(`senders/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                showAlert('success', 'Sender deleted successfully!');
                await fetchSenders();
            } catch (error) {
                console.error('Error deleting sender:', error);
                showAlert('danger', 'Failed to delete sender. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Email Senders</h2>
            
            {alert.show && (
                <Alert 
                    variant={alert.variant} 
                    onClose={() => setAlert({ show: false })} 
                    dismissible
                >
                    {alert.message}
                </Alert>
            )}

            <Button variant="primary" onClick={handleShow} className="mb-3">
                Add New Sender
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Last Used</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {senders.map((sender) => (
                        <tr key={sender.id}>
                            <td>{sender.email}</td>
                            <td>{new Date(sender.createdAt).toLocaleString()}</td>
                            <td>{new Date(sender.lastUsedAt).toLocaleString()}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    className="me-2"
                                    onClick={() => handleEdit(sender)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="danger"
                                    onClick={() => handleDelete(sender.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editMode ? 'Edit Sender' : 'Add New Sender'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={currentSender.email || ''}
                                onChange={(e) => setCurrentSender({
                                    ...currentSender,
                                    email: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>App Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter app password"
                                value={currentSender.password || ''}
                                onChange={(e) => setCurrentSender({
                                    ...currentSender,
                                    password: e.target.value
                                })}
                                required
                            />
                            <Form.Text className="text-muted">
                                Enter your Gmail App Password. You can generate one from your Google Account settings.
                            </Form.Text>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Save Changes' : 'Add Sender'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="text-center mt-5">
                            <Button className='btn-dark-blue' onClick={() => navigate(-1)}>
                                ← Geri Dön
                            </Button>
                        </div>
        </div>
    );
};

export default Senders; 