import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';

const EventDashboard = () => {
    const [event, setEvent] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        const storedEvent = localStorage.getItem('selectedEvent');
        if (storedEvent) {
            setEvent(JSON.parse(storedEvent));
        }
    }, [eventId]);

    if (!event) {
        return <Navigate to="/" replace />;
    }

    const features = [
        {
            title: 'Mail Templates',
            description: 'Create and manage email templates for this event',
            link: `/event/${eventId}/templates`,
            icon: '📝',
            color: 'primary',
            bgColor: 'rgba(0, 123, 255, 0.1)'
        },
        {
            title: 'Senders',
            description: 'Manage email senders for this event',
            link: `/event/${eventId}/senders`,
            icon: '👤',
            color: 'success',
            bgColor: 'rgba(40, 167, 69, 0.1)'
        },
        {
            title: 'Receivers',
            description: 'Manage email receivers and import from Excel',
            link: `/event/${eventId}/receivers`,
            icon: '👥',
            color: 'info',
            bgColor: 'rgba(23, 162, 184, 0.1)'
        },
        {
            title: 'Send Emails',
            description: 'Send emails using templates to receivers',
            link: `/event/${eventId}/send-mail`,
            icon: '✉️',
            color: 'warning',
            bgColor: 'rgba(255, 193, 7, 0.1)'
        }
    ];

    return (
        <Container className="mt-4">
            <Card className="mb-4 bg-light">
                <Card.Body>
                    <h2 className="mb-2">{event.name}</h2>
                    <p className="text-muted mb-1">{event.description}</p>
                    <small className="text-muted">Date: {event.date}</small>
                </Card.Body>
            </Card>

            <Row className="mt-4">
                {features.map((feature, index) => (
                    <Col md={6} lg={3} key={index} className="mb-4">
                        <Card 
                            as={Link} 
                            to={feature.link}
                            className="h-100 text-decoration-none hover-shadow"
                            style={{ 
                                transition: 'transform 0.2s',
                                backgroundColor: feature.bgColor
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Card.Body className="text-center">
                                <div 
                                    className="display-4 mb-3"
                                    style={{ fontSize: '3rem' }}
                                >
                                    {feature.icon}
                                </div>
                                <Card.Title className={`text-${feature.color}`}>
                                    {feature.title}
                                </Card.Title>
                                <Card.Text>{feature.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default EventDashboard; 