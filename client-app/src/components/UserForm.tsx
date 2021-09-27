import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Form, Grid, Header, Input, Label, Message, Segment } from "semantic-ui-react";
import api from "../app/api";
import { Role, User } from "../models/user";
import { UserContext } from "./UserProvider";

export default function UserForm(){
    const userCtx=React.useContext(UserContext);
    const {userRoles, setUserRoles, roles, setRoles}=userCtx;
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const initialState={
        Id: '',
        UserName: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        City: '',
        Token: '',
        Sales: [],
        Photos: [],
        Roles: []
    }
    const [user, setUser]=useState<User>(initialState);
    const [submiting, setSubmiting]=useState(false);
    const [error, setError]=useState("");
    useEffect(()=>{
        if(id){
            api.Users.details(id).then(response => {
                if(response!==null) setUser(response);
            }).catch((err)=>{
                console.log(err);
                setError(err);
            });
        };
    }, [id])
    const newRole={
        Id: '',
        Name: ''
    }
    const [role, setRole]=useState(newRole);
    function handleSubmit(){
        editUser(user);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value}=event.target;
        setUser({...user, [name]: value})
    }
    
    function editUser(user: User){
        setSubmiting(true);
        if (user.Id){
          api.Users.update(user).then(()=>{
            history.push('/');
          })
        } else {
          api.Users.create(user).then(()=>{
            history.push('/');
          })
        }
        setUser(user);
        setSubmiting(false);   
    }

    function closeForm(){
        history.push('/');
    }

    function handleAddRole(event: ChangeEvent<HTMLInputElement>){
        const {value}=event.target;
        setRole({Id: '', Name: value});   
    }

    function createRole(){
        if(role.Id === "" && !roles.some(r=>r.Name === role.Name)){
            setSubmiting(true);
            api.Roles.create({Name: role.Name}).then(response => {
                if(response!==null) setRole(response);
            }).catch((err)=>{
                console.log(err);
                setError(err);
            });
            setSubmiting(false);
        } 
    }

    function addRole(event: MouseEvent){
        console.log(event);
        const target=event.target as HTMLButtonElement;
        if(target.value!=='' && !userRoles.some(r=>r.Name === target.value)){
            const roleFromEvent = {Id: target.id, Name: target.value};
            setRole(roleFromEvent);
            setUser({...user, Roles: [...user.Roles, roleFromEvent.Id]});
            api.Roles.addrole(user.Id, roleFromEvent).then(response => {
                if(response!==null) setUser(response);
            }).catch((err)=>{
                console.log(err);
                setError(err);
            });
        }
    }

    function removeRole(event: MouseEvent){
        console.log(event);
        const target=event.target as HTMLButtonElement;
        if(target.value!=='' && userRoles.some(r=>r.Name === target.value)){
            setRole(newRole);
            setUser({...user, Roles: [...user.Roles.filter(r=>r !== target.id)]});
        }
    }

    return(
        <>
            <Grid centered columns={2}>
                <Grid.Column>
                    <Header as='h2'>Edit user "{user.UserName}"</Header>
                    <Segment.Group>
                    <Form onSubmit={handleSubmit} error={error?true:false}>
                        <Segment>
                            <Form.Input required placeholder='User Name' value={user.UserName || ''} name='UserName' onChange={handleInputChange}/>
                            <Form.Input required placeholder='Email' value={user.Email || ''} name='Email' onChange={handleInputChange}/>
                            <Form.Input placeholder='Phone Number' value={user.PhoneNumber || ''} name='PhoneNumber' onChange={handleInputChange}/>
                            <Form.Input placeholder='Address' value={user.Address || ''} name='Address' onChange={handleInputChange}/>
                            <Form.Input placeholder='City' value={user.City || ''} name='City' onChange={handleInputChange}/>
                        </Segment>
                        <Segment>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as='h4'>Roles of "{user.UserName}":</Header>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        {userRoles.map(r => (
                                            <Button size='mini' type='button' onClick={removeRole} id={r.Id} value={r.Name} key={r.Id}>{r.Name}</Button>
                                        ))}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={8}>
                                        <Header as='h4'>Available Roles:</Header>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        {roles.map(r => (
                                            <Button size='mini' type='button' onClick={addRole} id={r.Id} value={r.Name} key={r.Id}>{r.Name}</Button>
                                        ))}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Input placeholder='Add Role' name='Role' value={role.Name || ''} onChange={handleAddRole}/>
                                        <Button loading={submiting} onClick={createRole} type='button'>Create role</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                        <Segment>
                            <Button loading={submiting} positive type='submit'>Submit</Button>
                            <Button onClick={closeForm} type='button'>Cancel</Button>
                        </Segment>
                        <Message error content={error.toString()}/>
                    </Form>
                    </Segment.Group>
                </Grid.Column>
            </Grid>
        </>
    );
}