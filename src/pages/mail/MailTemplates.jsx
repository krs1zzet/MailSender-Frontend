import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MailTemplates.css';
import apiUtils from '../../utils/apiUtils';

const MailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({ header: '', body: '' });
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId } = useParams();
    const navigate = useNavigate();

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false }), 5000);
    };

    const fetchTemplates = async () => {
        try {
            const response = await apiUtils.fetchApi(`mailTemplates/${eventId}`);

            if (response.status === 404) {
                setTemplates([]);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const textData = await response.text();
            const templateData = textData === "" ? [] : JSON.parse(textData);
            setTemplates(templateData);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setError('Failed to fetch templates. Please try again later.');
            showAlert('danger', 'Failed to fetch templates. Please ensure the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            const parsedEvent = JSON.parse(storedEvent);
            if (parsedEvent.id.toString() === eventId) {
                setEvent(parsedEvent);
                fetchTemplates();
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
            const endpoint = editMode
                ? `mailTemplates/${currentTemplate.id}`
                : 'mailTemplates';

            const method = editMode ? 'PUT' : 'POST';

            const templateData = {
                header: currentTemplate.header,
                body: currentTemplate.body,
                eventId: parseInt(eventId)
            };

            console.log('Sending template data:', templateData);

            const response = await apiUtils.fetchApi(endpoint, {
                method: method,
                body: JSON.stringify(templateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            showAlert('success', `Template ${editMode ? 'updated' : 'created'} successfully!`);
            await fetchTemplates();
            handleClose();
        } catch (error) {
            console.error('Error saving template:', error);
            showAlert('danger', `Failed to save template: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                const response = await apiUtils.fetchApi(`mailTemplates/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                showAlert('success', 'Template deleted successfully!');
                await fetchTemplates();
            } catch (error) {
                console.error('Error deleting template:', error);
                showAlert('danger', 'Failed to delete template. Please try again.');
            }
        }
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-12 px-4 templates-container">
          
         <div className="mb-6">
  <h2 className="text">MAIL TEMPLATE
  </h2>
  <Button className="btn-dark-bluee" onClick={handleShow}>
    Create New Template
  </Button>
</div>
<div className="go-back-container">
                <Button className='geri' onClick={() => navigate(-1)}>
                    ← Geri
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

            <div className="templates-grid">
                {isLoading ? (
                    <div className="text-center py-5">
                        <span>Loading templates...</span>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : templates.length === 0 ? (
                    <Alert variant="info">
                        No templates found. Click "Create New Template" to add one.
                    </Alert>
                ) : (
                    <div className="row-cols-2">
                        {templates.map((template) => (
                            <Card key={template.id} className="cardd">
                                <Card.Body>
                                    <Card.Title>{template.header}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {template.body}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="bg-transparent border-0 d-flex justify-content-between">
                                    <Button
                                        variant="outline-primary"
                                        className="me-2"
                                        onClick={() => handleEdit(template)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleDelete(template.id)}
                                    >
                                        Delete
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editMode ? 'Edit Template' : 'Create New Template'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-5">
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
                        <Form.Group className="mb-5">
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
                        <div className="d-flex justify-content-end gap-4">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Save Changes' : 'Create Template'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Fixed "Geri Dön" button at the bottom */}
            
        </Container>
    );
};

export default MailTemplates;