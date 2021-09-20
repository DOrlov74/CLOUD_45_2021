import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import { Button, Form, Grid, Header, Message } from "semantic-ui-react";
import api from "../app/api";
import { UserDto } from "../models/user";

export default function LoginForm(){
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
        login(user);
    }

    async function login(user: UserDto){
        // try{
        // await api.Account.login(user);
        //   console.log(user);
        //   setSubmiting(false);
        //   history.push('/');
        // } catch(err: any){
        //     console.log(err);
        //     setError(err);
        //     setSubmiting(false);
        // };
        // try {
        //     const response = await axios.post('https://localhost:49154/api/login', user);
        //     console.log(response);
        //     setSubmiting(false);
        //     history.push('/');
        // } catch (err: any) {
        //     console.error(err);
        //     setError(err);
        //     setSubmiting(false);
        // }
        async function myFetch() {
            let response = await fetch('https://localhost:49154/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            } else {
              return await response.json();
            }
        }
        myFetch().then((result) => {
            console.log(result);
            setSubmiting(false);
            history.push('/');
        }).catch(e => {
            console.log(e);
            setError(e);
            setSubmiting(false);
        });  
    }

    function closeForm(){
        history.push('/');
    }
      
    return(
        <>
        <Grid centered columns={2}>
            <Grid.Column>
                <Header as='h2'>Login</Header>
                <Form onSubmit={handleSubmit} error={error?true:false}>
                    <Form.Input required placeholder='User Name' value={user.username} name='username' onChange={handleInputChange}/>
                    <Form.Input required placeholder='Email' value={user.email} name='email' onChange={handleInputChange}/>
                    <Form.Input required type='password' placeholder='Password' value={user.password} name='password' onChange={handleInputChange}/>
                    <Button loading={submiting} positive type='submit'>Login</Button>
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