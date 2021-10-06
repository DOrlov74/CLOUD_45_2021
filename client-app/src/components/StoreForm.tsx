import React, { ChangeEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Form, Grid, Header } from "semantic-ui-react";
import api from "../app/api";
import { Store } from "../models/store";

export default function StoreForm(){
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const initialState={
        Id: '',
        StoreName: '',
        StoreAddress: '',
        Active: false,
        Pos: [],
        Stocks: [],
    }
    const [store, setStore]=useState<Store>(initialState);
    const [submiting, setSubmiting]=useState(false);
    useEffect(()=>{
        if(id){
            api.Stores.details(id).then(response => {
                if(response!==null) setStore(response);
            }).catch((err)=>{
                console.log(err);
            });
        };
    }, [id])

    function handleSubmit(){
        editStore(store);
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value}=event.target;
        setStore({...store, [name]: value})
    }
    function toggleActive(){
        setStore({...store, Active: !store.Active})
    }
    function editStore(store: Store){
        setSubmiting(true);
        if (store.Id){
          api.Stores.update(store).then(()=>{
            history.push('/store');
          })
        } else {
          api.Stores.create(store).then(()=>{
            history.push('/store');
          })
        }
        setStore(store);
        setSubmiting(false);   
    }
    function closeForm(){
        history.push('/store');
    }
    return(
        <>
            <Grid centered columns={2}>
                <Grid.Column>
                    <Header as='h2'>New store</Header>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input required placeholder='Store Name' value={store.StoreName || ''} name='StoreName' onChange={handleInputChange}/>
                        <Form.Input required placeholder='Store Address' value={store.StoreAddress || ''} name='StoreAddress' onChange={handleInputChange}/>
                        <Form.Checkbox label='Active' checked={store.Active || false} name='Active' onChange={toggleActive}/>
                        <Button loading={submiting} positive type='submit'>Submit</Button>
                        <Button onClick={closeForm} type='button'>Cancel</Button>
                    </Form>
                </Grid.Column>
            </Grid>
        </>
    )
}