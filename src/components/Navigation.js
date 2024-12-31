import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Email Management System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/send-mail"
                            active={location.pathname === '/send-mail'}
                        >
                            Send Email
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/templates"
                            active={location.pathname === '/templates'}
                        >
                            Templates
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/senders"
                            active={location.pathname === '/senders'}
                        >
                            Senders
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/receivers"
                            active={location.pathname === '/receivers'}
                        >
                            Receivers
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation; 