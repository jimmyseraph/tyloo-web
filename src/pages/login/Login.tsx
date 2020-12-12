import React from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import LoginForm from '../../components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
    return (
        <Container className='my-login-page'>
            <Row className='justify-content-md-center'>
                <div className='card-wrapper'>
                    <Card className='fat'>
                        <Card.Body>
                            <Card.Title>Tyloo Login</Card.Title>
                            <LoginForm />
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </Container>
    );
}

export default Login;