import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({
        name: '',
        description: '',
        date: '',
        password: ''
    });
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/events', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            showAlert('danger', 'Failed to fetch events. Please ensure the backend server is running.');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false }), 5000);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentEvent({ name: '', description: '', date: '', password: '' });
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (event) => {
        setCurrentEvent({ ...event, password: '' }); // Don't show existing password
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editMode 
                ? `http://localhost:8080/api/events/${currentEvent.id}`
                : 'http://localhost:8080/api/events';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(currentEvent),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to save event');
            }

            showAlert('success', `Event ${editMode ? 'updated' : 'created'} successfully!`);
            handleClose();
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            showAlert('danger', `Failed to save event: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors'
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                showAlert('success', 'Event deleted successfully!');
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                showAlert('danger', 'Failed to delete event. Please try again.');
            }
        }
    };

    const handleSelectEvent = (event) => {
        console.log('Selecting event:', event);
        localStorage.setItem('selectedEvent', JSON.stringify(event));
        console.log('Stored in localStorage:', localStorage.getItem('selectedEvent'));
        navigate(`/events/${event.id}`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Events</h2>
                <Button variant="primary" onClick={handleShow}>
                    Create New Event
                </Button>
            </div>

            {alert.show && (
                <Alert 
                    variant={alert.variant} 
                    onClose={() => setAlert({ show: false })} 
                    dismissible
                >
                    {alert.message}
                </Alert>
            )}

            <Row>
                {events.map((event) => (
                    <Col md={6} lg={4} xl={3} key={event.id} className="mb-4">
                        <Card 
                            className="h-100 hover-shadow"
                            style={{ transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <Card.Text className="text-muted mb-2">
                                    {event.description}
                                </Card.Text>
                                <Card.Text>
                                    <small className="text-muted">
                                        Date: {event.date}
                                    </small>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="bg-transparent border-0 d-flex justify-content-between">
                                <Button 
                                    variant="success" 
                                    onClick={() => handleSelectEvent(event)}
                                >
                                    Select
                                </Button>
                                <div>
                                    <Button 
                                        variant="outline-primary" 
                                        className="me-2"
                                        onClick={() => handleEdit(event)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger"
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editMode ? 'Edit Event' : 'Create New Event'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event name"
                                value={currentEvent.name}
                                onChange={(e) => setCurrentEvent({
                                    ...currentEvent,
                                    name: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter event description"
                                value={currentEvent.description}
                                onChange={(e) => setCurrentEvent({
                                    ...currentEvent,
                                    description: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event date"
                                value={currentEvent.date}
                                onChange={(e) => setCurrentEvent({
                                    ...currentEvent,
                                    date: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter event password"
                                value={currentEvent.password}
                                onChange={(e) => setCurrentEvent({
                                    ...currentEvent,
                                    password: e.target.value
                                })}
                                required={!editMode}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Save Changes' : 'Create Event'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Events; 