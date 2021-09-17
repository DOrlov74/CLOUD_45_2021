import React, { SyntheticEvent, useState } from "react";
import { Button, Card, Header, Image } from "semantic-ui-react";
import { Store } from "../models/store";

interface Props{
    stores: Store[];
    openForm: (id:string)=>void;
    deleteStore: (id: string)=>void;
    submitting: boolean;
}

export default function StoreList({stores, openForm, deleteStore, submitting}: Props) {
    const [target, setTarget] = useState('');
    function handleDeleteStore(e: SyntheticEvent<HTMLButtonElement>, id:string){
        setTarget(e.currentTarget.name);
        deleteStore(id);
    }
    return(
        <>
            <Header as='h1'>The stores</Header>
            <Card.Group>
                {stores.map(store => (
                    <Card key={store.Id}>
                    <Card.Content>
                        {/* <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                        /> */}
                        <Card.Header>{store.StoreName}</Card.Header>
                        <Card.Meta>{store.StoreAddress}</Card.Meta>
                        <Card.Description>
                        The store is <strong>{store.Active ? "Active" : "Inactive" }</strong>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui three buttons'>
                        <Button basic color='yellow'>
                            View Stock
                        </Button>
                        <Button onClick={()=>openForm(store.Id)} basic color='green'>
                            Edit
                        </Button>
                        <Button name={store.Id} loading={submitting && target === store.Id} onClick={(e)=>handleDeleteStore(e,store.Id)} basic color='red'>
                            Delete
                        </Button>
                        </div>
                    </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        </>
)}