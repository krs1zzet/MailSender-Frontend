import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Receivers = () => {
    const [receivers, setReceivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentReceiver, setCurrentReceiver] = useState({ 
        fname: '', 
        lname: '', 
        email: '', 
        groupName: '',
        id: null
    });
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false }), 5000);
    };

    const fetchReceivers = async () => {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token); // Debugging line
        try {
            const response = await fetch(`http://localhost:8080/api/receivers/${eventId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const textData = await response.text();
            const data = textData === "" ? [] : JSON.parse(textData);
            setReceivers(data);
        } catch (error) {
            console.error('Error fetching receivers:', error);
            setError(error);
            showAlert('danger', 'Failed to fetch receivers. Please ensure the backend server is running.');
        }
    };

    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            const parsedEvent = JSON.parse(storedEvent);
            if (parsedEvent.id.toString() === eventId) {
                fetchReceivers();
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
        setCurrentReceiver({ 
            fname: '', 
            lname: '', 
            email: '', 
            groupName: '',
            id: null
        });
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (receiver) => {
        setCurrentReceiver({
            id: receiver.id || null,
            fname: receiver.fname || '',
            lname: receiver.lname || '',
            email: receiver.email || '',
            groupName: receiver.groupName || ''
        });
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
            
            // Include eventId in the receiver data
            const receiverData = {
                fname: currentReceiver.fname,
                lname: currentReceiver.lname,
                email: currentReceiver.email,
                eventId: parseInt(eventId)
            };
            
            console.log('Sending receiver data:', receiverData);
            
            const token = localStorage.getItem('token');
            console.log('Retrieved token:', token); // Debugging line
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(receiverData),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            showAlert('success', `Receiver ${editMode ? 'updated' : 'created'} successfully!`);
            await fetchReceivers();
            handleClose();
        } catch (error) {
            console.error('Error saving receiver:', error);
            showAlert('danger', `Failed to save receiver: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this receiver?')) {
            try {
                const token = localStorage.getItem('token');
                console.log('Retrieved token:', token); // Debugging line
                const response = await fetch(`http://localhost:8080/api/receivers/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
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

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', eventId);

        try {
            const token = localStorage.getItem('token');
            console.log('Retrieved token:', token);
            const response = await fetch('http://localhost:8080/api/receivers/excel', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            showAlert('success', 'Receivers imported successfully!');
            await fetchReceivers(); // Refresh the receivers list
            e.target.value = ''; // Reset file input
        } catch (error) {
            console.error('Error uploading Excel:', error);
            showAlert('danger', `Failed to import receivers: ${error.message}`);
        }
    };

    // Add file input validation
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an Excel or CSV file
        if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
            showAlert('danger', 'Please select an Excel (.xlsx, .xls) or CSV (.csv) file');
            e.target.value = '';
            return;
        }

        handleExcelUpload(e);
    };

    const handleDownloadTemplate = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Retrieved token:', token); // Debugging line
            const response = await fetch('http://localhost:8080/api/receivers/excelTemplate', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.ms-excel'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download template');
            }

            // Create blob from response
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'receivers_template.xlsx';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showAlert('success', 'Template downloaded successfully!');
        } catch (error) {
            console.error('Error downloading template:', error);
            showAlert('danger', 'Failed to download template');
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Receivers</h2>
            
            {alert.show && (
                <Alert 
                    variant={alert.variant} 
                    onClose={() => setAlert({ show: false })} 
                    dismissible
                >
                    {alert.message}
                </Alert>
            )}

            <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={handleShow}>
                    Add New Receiver
                </Button>
                
                <div className="d-flex align-items-center gap-3">
                    <Form.Group>
                        <Form.Label 
                            htmlFor="file-upload" 
                            className="mb-0 me-2"
                        >
                            Import from file:
                        </Form.Label>
                        <Form.Control
                            type="file"
                            id="file-upload"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <div className="d-flex gap-2">
                            <Button 
                                variant="success" 
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                Upload File
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                onClick={handleDownloadTemplate}
                            >
                                Download Template
                            </Button>
                        </div>
                        <Form.Text className="text-muted">
                            Supported formats: Excel (.xlsx, .xls) and CSV (.csv)
                        </Form.Text>
                    </Form.Group>
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
                                value={currentReceiver.fname || ''}
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
                                value={currentReceiver.lname || ''}
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
                                value={currentReceiver.email || ''}
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
                                value={currentReceiver.groupName || ''}
                                onChange={(e) => setCurrentReceiver({
                                    ...currentReceiver,
                                    groupName: e.target.value
                                })}
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