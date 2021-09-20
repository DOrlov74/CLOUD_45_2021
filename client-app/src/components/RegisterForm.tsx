import React, { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import { Button, Form, Grid, Header, Message } from "semantic-ui-react";
import api from "../app/api";
import { UserDto } from "../models/user";

export default function RegisterForm(){
    const history = useHistory();
    const initialState= {
        username: '',
        email: '',
        password: ''
    }
    const [user, setUser]=useState(initialState);
    const [submiting, setSubmiting]=useState(false);
    const [error, setError]=useState("");
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value}=event.target;
        setUser({...user, [name]: value})
    }
    function handleSubmit(){
        setSubmiting(true);
        register(user);
    }

    async function register(user: UserDto){
        try {
        await api.Account.register(user)
          console.log(user);
          setSubmiting(false);
          history.push('/');
        } catch(err: any){
            console.log(err);
            setError(err.Message);
            setSubmiting(false);
        };
           
      }

    function closeForm(){
        history.push('/');
    }
      
    return(
        <>
        <Grid centered columns={2}>
            <Grid.Column>
                <Header as='h2'>Register</Header>
                <Form onSubmit={handleSubmit} error={error?true:false}>
                    <Form.Input required placeholder='User Name' value={user.username} name='username' onChange={handleInputChange}/>
                    <Form.Input required placeholder='Email' value={user.email} name='email' onChange={handleInputChange}/>
                    <Form.Input required type='password' placeholder='Password' value={user.password} name='password' onChange={handleInputChange}/>
                    <Button loading={submiting} positive type='submit'>Register</Button>
                    <Button onClick={closeForm} type='button'>Cancel</Button>
                    <Message
                        error
                        content={error.toString()}
                    />
                </Form>
            </Grid.Column>
        </Grid>
        </>
    );
}