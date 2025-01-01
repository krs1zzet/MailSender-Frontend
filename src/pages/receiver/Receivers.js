import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Receivers = () => {
    const [receivers, setReceivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentReceiver, setCurrentReceiver] = useState({ 
        fname: '', 
        lname: '', 
        email: '', 
        groupName: '' 
    });
    const [uploadAlert, setUploadAlert] = useState({ show: false, variant: '', message: '' });

    const fetchReceivers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/receivers', {
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
            setReceivers(data);
        } catch (error) {
            console.error('Error fetching receivers:', error);
            alert('Failed to fetch receivers. Please ensure the backend server is running.');
        }
    };

    useEffect(() => {
        fetchReceivers();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentReceiver({ fname: '', lname: '', email: '', groupName: '' });
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (receiver) => {
        setCurrentReceiver(receiver);
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editMode 
                ? `http://localhost:8080/api/receivers/${currentReceiver.id}`
                : 'http://localhost:8080/api/receivers';
            
            const method = editMode ? 'PUT' : 'POST';
            
            console.log('Sending request to:', url);
            console.log('Request payload:', currentReceiver);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(currentReceiver),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const responseData = await response.json();
                console.log('Success response:', responseData);
            } else {
                console.log('Success response (no content)');
            }

            await fetchReceivers();
            handleClose();
            setCurrentReceiver({ fname: '', lname: '', email: '', groupName: '' });
        } catch (error) {
            console.error('Detailed error:', error);
            if (!window.navigator.onLine) {
                alert('No internet connection. Please check your network.');
            } else if (error.message === 'Failed to fetch') {
                alert('Cannot connect to the server. Please ensure:\n1. Backend server is running on localhost:8080\n2. No CORS issues\n3. Server endpoints are correct');
            } else if (error instanceof SyntaxError) {
                alert('Received invalid response from server. Please check server logs.');
            } else {
                alert(`Failed to save the receiver: ${error.message}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this receiver?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/receivers/${id}`, {
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

                fetchReceivers();
            } catch (error) {
                console.error('Error deleting receiver:', error);
                alert('Failed to delete receiver. Please try again.');
            }
        }
    };

    const handleExcelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is an Excel file
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setUploadAlert({
                show: true,
                variant: 'danger',
                message: 'Please upload an Excel file (.xlsx or .xls)'
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/receivers/excel', {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to upload Excel file');
            }

            setUploadAlert({
                show: true,
                variant: 'success',
                message: 'Receivers imported successfully!'
            });

            // Refresh the receivers list
            await fetchReceivers();

            // Reset file input
            event.target.value = '';
        } catch (error) {
            console.error('Error uploading Excel:', error);
            setUploadAlert({
                show: true,
                variant: 'danger',
                message: `Failed to upload: ${error.message}`
            });
        }

        // Hide alert after 5 seconds
        setTimeout(() => {
            setUploadAlert({ show: false, variant: '', message: '' });
        }, 5000);
    };

    return (
        <div className="container mt-4">
            <h2>Receivers</h2>
            
            {/* Alert for Excel upload feedback */}
            {uploadAlert.show && (
                <Alert 
                    variant={uploadAlert.variant} 
                    onClose={() => setUploadAlert({ show: false })} 
                    dismissible
                    className="mb-3"
                >
                    {uploadAlert.message}
                </Alert>
            )}

            <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={handleShow}>
                    Add New Receiver
                </Button>
                
                {/* Excel upload button */}
                <div className="d-flex align-items-center">
                    <Form.Label 
                        htmlFor="excel-upload" 
                        className="mb-0 me-2"
                    >
                        Import from Excel:
                    </Form.Label>
                    <Form.Control
                        type="file"
                        id="excel-upload"
                        accept=".xlsx,.xls"
                        onChange={handleExcelUpload}
                        style={{ display: 'none' }}
                    />
                    <Button 
                        variant="success" 
                        onClick={() => document.getElementById('excel-upload').click()}
                    >
                        Upload Excel
                    </Button>
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Group Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {receivers.map((receiver) => (
                        <tr key={receiver.id}>
                            <td>{receiver.fname}</td>
                            <td>{receiver.lname}</td>
                            <td>{receiver.email}</td>
                            <td>{receiver.groupName}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    className="me-2"
                                    onClick={() => handleEdit(receiver)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="danger"
                                    onClick={() => handleDelete(receiver.id)}
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
                        {editMode ? 'Edit Receiver' : 'Add New Receiver'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={currentReceiver.fname}
                                onChange={(e) => setCurrentReceiver({
                                    ...currentReceiver,
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
                                value={currentReceiver.lname}
                                onChange={(e) => setCurrentReceiver({
                                    ...currentReceiver,
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
                                value={currentReceiver.email}
                                onChange={(e) => setCurrentReceiver({
                                    ...currentReceiver,
                                    email: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter group name"
                                value={currentReceiver.groupName}
                                onChange={(e) => setCurrentReceiver({
                                    ...currentReceiver,
                                    groupName: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Save Changes' : 'Add Receiver'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Receivers; 