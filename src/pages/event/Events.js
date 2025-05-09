import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Events.css';
import apiUtils from '../../utils/apiUtils';

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
    const token = localStorage.getItem('token');
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const response = await apiUtils.fetchApi('events');
            
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
            const endpoint = editMode 
                ? `events/${currentEvent.id}`
                : 'events';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const response = await apiUtils.fetchApi(endpoint, {
                method: method,
                body: JSON.stringify(currentEvent)
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
                const response = await apiUtils.fetchApi(`events/${id}`, {
                    method: 'DELETE'
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
        try {
            localStorage.setItem('selectedEvent', JSON.stringify(event));
            console.log('Stored in localStorage:', localStorage.getItem('selectedEvent'));
            navigate(`/events/${event.id}`);
        } catch (error) {
            console.error('Error storing event:', error);
        }
    };
    return (
        <Container className="events-container">
            <div className="page-header">
                <div className="left-header">
                    <h2 className="event">Events</h2>
                </div>
                <div className="right-header">
                    <Button className="btn-custom-primary create-event-btn" onClick={handleShow}>
                        Create New Event
                    </Button>
                </div>
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

            <Row className="card-row">
                {events.length === 0 ? (
                    <Col xs={14}>
                        <div className="text-center p-5 bg-light rounded">
                            <p className="mb-0">No events found. Click "Create New Event" to get started.</p>
                        </div>
                    </Col>
                ) : (
                    events.map((event) => (
                        <Col md={8} lg={6} key={event.id} className="card-column">
                            <Card className="event-card h-100 shadow-sm">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="event-title">{event.name}</Card.Title>
                                    <Card.Text className="event-description text-muted mb-2">
                                        {event.description}
                                    </Card.Text>
                                    <Card.Text className="event-date small text-muted mb-3">
                                        <strong>Date:</strong> {event.date}
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <div className="d-grid mb-2">
                                            <Button 
                                                className="btn-custom-primary w-100"
                                                onClick={() => handleSelectEvent(event)}
                                            >
                                                Select
                                            </Button>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <Button 
                                                variant="outline-primary" 
                                                className="flex-grow-1 me-2 edit-btn"
                                                onClick={() => handleEdit(event)}
                                                size="sm"
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="outline-danger"
                                                className="flex-grow-1 delete-btn"
                                                onClick={() => handleDelete(event.id)}
                                                size="sm"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
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
                                type="date" 
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
                            <Button className="btn-custom-primary" type="submit">
                                {editMode ? 'Save Changes' : 'Create Event'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Events;