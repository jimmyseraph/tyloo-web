import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import Request from '../utils/Request';
import { userLogin } from '../api/ApiConfig';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);

    const handleEmailChange = (event: FormEvent) => {
        const element = event.target as HTMLInputElement;
        setEmail(element.value);
    }

    const handlePasswordChange = (event: FormEvent) => {
        const element = event.target as HTMLInputElement;
        setPassword(element.value);
    }

    const handleSubmit = (event: FormEvent) => {
        const form = event.currentTarget as HTMLFormElement;
        event.preventDefault();
        if(form.checkValidity() === false){
            event.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        let payload = {
            email,
            password,
        };
        Request({
            url: userLogin.path,
            method: 'post',
            headers: {"Content-Type": "application/json; charset=utf-8"},
            data: JSON.stringify(payload),
        }, (res) => {
            sessionStorage.setItem("user", res.data.data.username);
            sessionStorage.setItem("token", res.data.data.token);
            window.location.href="/";
        });
    }

    return (
        <Form className='my-login-validation' noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId='emailInput'>
                <Form.Label>E-Mail Address</Form.Label>
                <Form.Control type='email' placeholder="name@example.com" name="email" value={email} onChange={handleEmailChange} required />
                <Form.Control.Feedback type='invalid'>Email is invalid</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='passwordInput'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' name="password" value={password} onChange={handlePasswordChange} required />
                <Form.Control.Feedback type='invalid'>Password is invalid</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Button variant='primary' type='submit' size='lg' block>Login</Button>
            </Form.Group>
        </Form>
    );
}

export default LoginForm;