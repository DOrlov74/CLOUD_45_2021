import React, { ChangeEvent, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { Store } from "../models/store";

interface Props{
    store: Store | undefined;
    closeForm: ()=>void;
    editStore: (store: Store)=>void;
    submitting: boolean;
}

export default function StoreForm({store: selectedStore, closeForm, editStore, submitting}: Props){
    const initialState=selectedStore ?? {
        Id: '',
        StoreName: '',
        StoreAddress: '',
        Active: false,
        Pos: [],
        Stocks: [],
    }
    const [store, setStore]=useState(initialState);
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
    return(
        <>
        <Header as='h2'>New store</Header>
        <Form onSubmit={handleSubmit}>
            <Form.Input required placeholder='Store Name' value={store.StoreName} name='StoreName' onChange={handleInputChange}/>
            <Form.Input required placeholder='Store Address' value={store.StoreAddress} name='StoreAddress' onChange={handleInputChange}/>
            <Form.Checkbox label='Active' checked={store.Active} name='Active' onChange={toggleActive}/>
            <Button loading={submitting} positive type='submit'>Submit</Button>
            <Button onClick={closeForm} type='button'>Cancel</Button>
        </Form>
        </>
    )
}