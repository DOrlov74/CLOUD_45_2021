import React, { SyntheticEvent, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Card, Divider, Header, Icon } from "semantic-ui-react";
import api from "../app/api";
import { Store } from "../models/store";
import { UserContext } from "./UserProvider";

export default function StoreList() {
    const userCtx=React.useContext(UserContext);
    const [target, setTarget] = useState('');
    const [stores, setStores]=useState<Store[]>([]);
    const [selectedStore, setSelectedStore]=useState<Store|undefined>(undefined);
    const [submiting, setSubmiting]=useState(false);
    useEffect(() => {
        api.Stores.list().then(response => {
          console.log(response);
          setStores(response);
        })
      }, [])
    function handleDeleteStore(e: SyntheticEvent<HTMLButtonElement>, id:string){
        setTarget(e.currentTarget.name);
        setSubmiting(true);
        api.Stores.delete(id).then(()=>{
        setStores([...stores.filter(s=>s.Id !== id)]);
        setSubmiting(false);
        });
    }
      
    return(
        <>
            <Header as='h1'>Our stores</Header>
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
                        <Button color='yellow'>
                            View Stock
                        </Button>
                        <Button as={Link} to={`/editstore/${store.Id}`} color='green'>
                            Edit
                        </Button>
                        <Button name={store.Id} loading={submiting && target === store.Id} onClick={(e)=>handleDeleteStore(e,store.Id)} color='orange'>
                            Delete
                        </Button>
                        </div>
                    </Card.Content>
                    </Card>
                ))}
            </Card.Group>
            {userCtx.userRoles.some((r)=>r.Name === "admin")?
            <>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='edit outline' />
                    New Store
                </Header>
            </Divider>
            <Card.Group centered>
                <Button as={NavLink} to='/newstore' positive content='Create Store'/>
            </Card.Group>
            </>:<></>
            }
        </>
)}