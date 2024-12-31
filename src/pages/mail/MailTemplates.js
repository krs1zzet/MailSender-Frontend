import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({ header: '', body: '' });

    const fetchTemplates = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/mails', {
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
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
            alert('Failed to fetch templates. Please ensure the backend server is running.');
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentTemplate({ header: '', body: '' });
    };

    const handleShow = () => setShowModal(true);

    const handleEdit = (template) => {
        setCurrentTemplate(template);
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editMode 
                ? `http://localhost:8080/api/mails/${currentTemplate.id}`
                : 'http://localhost:8080/api/mails';
            
            const method = editMode ? 'PUT' : 'POST';
            
            console.log('Sending request to:', url);
            console.log('Request payload:', currentTemplate);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(currentTemplate),
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

            await fetchTemplates();
            handleClose();
            setCurrentTemplate({ header: '', body: '' });
        } catch (error) {
            console.error('Detailed error:', error);
            if (!window.navigator.onLine) {
                alert('No internet connection. Please check your network.');
            } else if (error.message === 'Failed to fetch') {
                alert('Cannot connect to the server. Please ensure:\n1. Backend server is running on localhost:8080\n2. No CORS issues\n3. Server endpoints are correct');
            } else if (error instanceof SyntaxError) {
                alert('Received invalid response from server. Please check server logs.');
            } else {
                alert(`Failed to save the template: ${error.message}`);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/mails/${id}`, {
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

                fetchTemplates();
            } catch (error) {
                console.error('Error deleting template:', error);
                alert('Failed to delete template. Please try again.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Mail Templates</h2>
            <Button variant="primary" onClick={handleShow} className="mb-3">
                Add New Template
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Header</th>
                        <th>Body</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template) => (
                        <tr key={template.id}>
                            <td>{template.header}</td>
                            <td>{template.body}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    className="me-2"
                                    onClick={() => handleEdit(template)}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="danger"
                                    onClick={() => handleDelete(template.id)}
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
                        {editMode ? 'Edit Template' : 'Add New Template'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Header</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter template header"
                                value={currentTemplate.header}
                                onChange={(e) => setCurrentTemplate({
                                    ...currentTemplate,
                                    header: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Body</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter template body"
                                value={currentTemplate.body}
                                onChange={(e) => setCurrentTemplate({
                                    ...currentTemplate,
                                    body: e.target.value
                                })}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Save Changes' : 'Add Template'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MailTemplates; 