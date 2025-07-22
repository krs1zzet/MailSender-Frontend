import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import apiUtils from '../../utils/apiUtils';
import './SendMail.css'; // We'll create this CSS file

const SendMail = () => {
    const [mailTemplates, setMailTemplates] = useState([]);
    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedSender, setSelectedSender] = useState(null);
    const [selectedReceivers, setSelectedReceivers] = useState([]);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const { eventId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            const parsedEvent = JSON.parse(storedEvent);
            if (parsedEvent.id.toString() === eventId) {
                fetchAllData();
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [eventId, navigate]);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchMailTemplates(),
                fetchSenders(),
                fetchReceivers()
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMailTemplates = async () => {
        try {
            const response = await apiUtils.fetchApi(`mailTemplates/${eventId}`);
            
            if (response.status === 404) {
                setMailTemplates([]);
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch mail templates');
            
            const data = await response.json();
            setMailTemplates(Array.isArray(data) ? data.map(template => ({
                value: template.id,
                label: template.header
            })) : []);
        } catch (error) {
            showAlert('danger', 'Failed to load mail templates');
            console.error('Error:', error);
        }
    };

    const fetchSenders = async () => {
        try {
            const response = await apiUtils.fetchApi(`senders/${eventId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const data = text === "" ? [] : JSON.parse(text);
            const formattedSenders = data.map(sender => ({
                value: sender.id,
                label: sender.email
            }));
            setSenders(formattedSenders);
        } catch (error) {
            console.error('Error fetching senders:', error);
            throw new Error('Failed to fetch senders');
        }
    };

    const fetchReceivers = async () => {
        try {
            const response = await apiUtils.fetchApi(`receivers/${eventId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const data = text === "" ? [] : JSON.parse(text);
            const formattedReceivers = data.map(receiver => ({
                value: receiver.id,
                label: `${receiver.email} - ${receiver.groupName || 'No Group'}`
            }));
            setReceivers(formattedReceivers);
        } catch (error) {
            console.error('Error fetching receivers:', error);
            throw new Error('Failed to fetch receivers');
        }
    };

    const showAlert = (variant, message) => {
        setAlert({ show: true, variant, message });
        setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedTemplate || !selectedSender || selectedReceivers.length === 0) {
            showAlert('warning', 'Please select all required fields');
            return;
        }

        try {
            const receiverIdsString = selectedReceivers
                .map(receiver => receiver.value)
                .join(',');

            const endpoint = `send-mail?senderID=${selectedSender.value}&receiverIDs=${receiverIdsString}&mailTemplateID=${selectedTemplate.value}`;
            
            setIsSending(true);

            const response = await apiUtils.fetchApi(endpoint, {
                method: 'POST'
            });

            const result = await response.json();

            setIsSending(false);

            if (result.success) {
                showAlert('success', '✅ All emails have been sent successfully!');
                // Clear form if successful
                setSelectedTemplate(null);
                setSelectedSender(null);
                setSelectedReceivers([]);
            } else {
                // Handle different error scenarios
                let errorMessage = '';
                let variant = 'warning';

                if (result.failedEmails && result.failedEmails.length > 0) {
                    errorMessage = `⚠️ Failed to send emails to: ${result.failedEmails.join(', ')}`;
                    if (result.message) {
                        errorMessage += `\nReason: ${result.message}`;
                    }
                } else if (result.message && result.message.includes("Authentication failed")) {
                    errorMessage = '🔒 Sender authentication failed. Please check the sender\'s email and app password.';
                    variant = 'danger';
                } else if (result.message && result.message.includes("Template")) {
                    errorMessage = '📝 There was an issue with the email template. Please verify the template content.';
                    variant = 'warning';
                } else if (result.message && result.message.includes("Invalid")) {
                    errorMessage = '❌ Invalid request. Please check all selected values.';
                    variant = 'danger';
                } else {
                    errorMessage = result.message || 'Unknown error occurred';
                    variant = 'danger';
                }

                showAlert(variant, errorMessage);
            }
        } catch (error) {
            console.error('Error sending emails:', error);
            setIsSending(false);
            showAlert('danger', 'Failed to send emails: ' + (error.message || 'Server error'));
        }
    };

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderColor: '#ced4da',
            '&:hover': {
                borderColor: '#80bdff'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0e2158' : state.isFocused ? '#f8f9fa' : null,
            color: state.isSelected ? 'white' : 'black',
        }),
    };

    return (
        <Container className="send-mail-container">
            <div className="content-wrapper">
                <div className="header-section">
                    <h2 className="page-title">SEND EMAILS</h2>
                </div>
                <div className='line'>
                </div>
                {isLoading ? (
                    <div className="loading-indicator">
                        <span>Loading...</span>
                    </div>
                ) : (
                    <div className="form-section">
                        {alert.show && (
                            <Alert 
                                variant={alert.variant} 
                                onClose={() => setAlert({ show: false })} 
                                dismissible
                                className="custom-alert"
                            >
                                <div className="alert-message">
                                    {alert.message}
                                </div>
                            </Alert>
                        )}

                        {mailTemplates.length === 0 && (
                            <Alert variant="warning" className="warning-alert">
                                No mail templates available. Please create a template first.
                            </Alert>
                        )}

                        {senders.length === 0 && (
                            <Alert variant="warning" className="warning-alert">
                                No senders available. Please add a sender first.
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit} className="email-form">
                            <Form.Group className="form-group">
                                <Form.Label>Mail Template</Form.Label>
                                <Select
                                    value={selectedTemplate}
                                    onChange={setSelectedTemplate}
                                    options={mailTemplates}
                                    placeholder="Select a template..."
                                    isSearchable
                                    styles={customSelectStyles}
                                    className="react-select"
                                />
                            </Form.Group>

                            <Form.Group className="form-group">
                                <Form.Label>Sender Email</Form.Label>
                                <Select
                                    value={selectedSender}
                                    onChange={setSelectedSender}
                                    options={senders}
                                    placeholder="Select a sender..."
                                    isSearchable
                                    styles={customSelectStyles}
                                    className="react-select"
                                />
                            </Form.Group>

                            <Form.Group className="form-group">
                                <Form.Label>Receivers</Form.Label>
                                <Select
                                    value={selectedReceivers}
                                    onChange={setSelectedReceivers}
                                    options={receivers}
                                    placeholder="Select receivers..."
                                    isMulti
                                    isSearchable
                                    styles={customSelectStyles}
                                    className="react-select"
                                />
                                <Form.Text className="helper-text">
                                    You can select multiple receivers
                                </Form.Text>
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={isSending || !selectedTemplate || !selectedSender || selectedReceivers.length === 0}
                                className="submit-button"
                            >
                                {isSending ? 'Sending...' : 'Send Emails'}
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
            
            {/* Fixed position back button */}
            <div className="go-back-container">
                <Button className='btn-dark-blue' onClick={() => navigate(-1)}>
                    ← Geri
                </Button>
            </div>
        </Container>
    );
};

export default SendMail;