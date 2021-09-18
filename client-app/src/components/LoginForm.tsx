import React, { ChangeEvent, useState } from "react";
import { Button, Form, Grid, Header } from "semantic-ui-react";
import { UserDto } from "../models/user";

interface Props{
    userdto: UserDto|null,
    closeForm: ()=>void;
    login: (user: UserDto)=>void;
    submitting: boolean;
}

export default function LoginForm({userdto, login, submitting, closeForm}: Props){
    const initialState=userdto?? {
        username: '',
        email: '',
        password: ''
    }
    const [user, setUser]=useState(initialState);
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value}=event.target;
        setUser({...user, [name]: value})
    }
    function handleSubmit(){
        login(user);
    }
    return(
        <>
        <Grid centered columns={2}>
            <Grid.Column>
                <Header as='h2'>Login</Header>
                <Form onSubmit={handleSubmit}>
                    <Form.Input required placeholder='User Name' value={user.username} name='username' onChange={handleInputChange}/>
                    <Form.Input required placeholder='Email' value={user.email} name='email' onChange={handleInputChange}/>
                    <Form.Input required type='password' placeholder='Password' value={user.password} name='password' onChange={handleInputChange}/>
                    <Button loading={submitting} positive type='submit'>Submit</Button>
                    <Button onClick={closeForm} type='button'>Cancel</Button>
                </Form>
            </Grid.Column>
        </Grid>
        </>
    );
}