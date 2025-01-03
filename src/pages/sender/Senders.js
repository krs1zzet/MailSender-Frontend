import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Senders = () => {
    const [senders, setSenders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSender, setCurrentSender] = useState({ fname: '', lname: '', email: '' });
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const { eventId } = useParams();
    const navigate = useNavigate();

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false }), 5000);
    };

    const fetchSenders = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/senders/${eventId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setSenders(data);
        } catch (error) {
            console.error('Error fetching senders:', error);
            showAlert('danger', 'Failed to fetch senders. Please ensure the backend server is running.');
        }
    };

    useEffect(() => {
        fetchSenders();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentSender({ fname: '', lname: '', email: '' });
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (sender) => {
        setCurrentSender(sender);
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editMode 
                ? `http://localhost:8080/api/senders/${currentSender.id}`
                : 'http://localhost:8080/api/senders';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const senderData = {
                fname: currentSender.fname,
                lname: currentSender.lname,
                email: currentSender.email,
                eventId: parseInt(eventId)
            };
            
            console.log('Sending sender data:', senderData);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(senderData),
                mode: 'cors'
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
                const response = await fetch(`http://localhost:8080/api/senders/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                fetchSenders();
            } catch (error) {
                console.error('Error deleting sender:', error);
                alert('Failed to delete sender. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Senders</h2>
            <Button variant="primary" onClick={handleShow} className="mb-3">
                Add New Sender
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {senders.map((sender) => (
                        <tr key={sender.id}>
                            <td>{sender.fname}</td>
                            <td>{sender.lname}</td>
                            <td>{sender.email}</td>
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
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={currentSender.fname}
                                onChange={(e) => setCurrentSender({
                                    ...currentSender,
                                    fname: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={currentSender.lname}
                                onChange={(e) => setCurrentSender({
                                    ...currentSender,
                                    lname: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={currentSender.email}
                                onChange={(e) => setCurrentSender({
                                    ...currentSender,
                                    email: e.target.value
                                })}
                                required
                            />
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
        </div>
    );
};

export default Senders; 