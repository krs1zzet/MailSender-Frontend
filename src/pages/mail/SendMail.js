import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const SendMail = () => {
    const [mailTemplates, setMailTemplates] = useState([]);
    const [senders, setSenders] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedSender, setSelectedSender] = useState(null);
    const [selectedReceivers, setSelectedReceivers] = useState([]);
    const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

    // Fetch all required data on component mount
    useEffect(() => {
        fetchMailTemplates();
        fetchSenders();
        fetchReceivers();
    }, []);

    const fetchMailTemplates = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/mails', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Failed to fetch mail templates');
            const data = await response.json();
            setMailTemplates(data.map(template => ({
                value: template.id,
                label: template.header
            })));
        } catch (error) {
            showAlert('danger', 'Failed to load mail templates');
            console.error('Error:', error);
        }
    };

    const fetchSenders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/senderers', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Failed to fetch senders');
            const data = await response.json();
            setSenders(data.map(sender => ({
                value: sender.id,
                label: `${sender.fname} ${sender.lname} (${sender.email})`
            })));
        } catch (error) {
            showAlert('danger', 'Failed to load senders');
            console.error('Error:', error);
        }
    };

    const fetchReceivers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/receivers', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Failed to fetch receivers');
            const data = await response.json();
            setReceivers(data.map(receiver => ({
                value: receiver.id,
                label: `${receiver.fname} ${receiver.lname} (${receiver.email}) - ${receiver.groupName}`
            })));
        } catch (error) {
            showAlert('danger', 'Failed to load receivers');
            console.error('Error:', error);
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
            const receiverIds = selectedReceivers.map(receiver => receiver.value);
            const url = new URL('http://localhost:8080/api/send-mail');
            url.searchParams.append('senderID', selectedSender.value);
            receiverIds.forEach(id => url.searchParams.append('receiverIDs', id));
            url.searchParams.append('mailTemplateID', selectedTemplate.value);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to send email');
            }

            showAlert('success', 'Email sent successfully!');
            // Reset selections
            setSelectedTemplate(null);
            setSelectedSender(null);
            setSelectedReceivers([]);
        } catch (error) {
            showAlert('danger', `Failed to send email: ${error.message}`);
            console.error('Error:', error);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Send Email</h2>
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Mail Template</Form.Label>
                    <Select
                        value={selectedTemplate}
                        onChange={setSelectedTemplate}
                        options={mailTemplates}
                        placeholder="Select a template..."
                        isSearchable
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Sender</Form.Label>
                    <Select
                        value={selectedSender}
                        onChange={setSelectedSender}
                        options={senders}
                        placeholder="Select a sender..."
                        isSearchable
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Receivers</Form.Label>
                    <Select
                        value={selectedReceivers}
                        onChange={setSelectedReceivers}
                        options={receivers}
                        placeholder="Select receivers..."
                        isMulti
                        isSearchable
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Send Email
                </Button>
            </Form>
        </Container>
    );
};

export default SendMail; 