import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface Props{
    activeItem: string;
    handleItemClick: (name: string)=>void;
    openForm: ()=>void;
}

export default function NavBar({activeItem='home', handleItemClick, openForm}: Props){
    return(
        <Menu pointing secondary>
            <Container>
                <Menu.Item header name='home'
                    active={activeItem === 'home'}
                    onClick={()=>handleItemClick('home')}>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:"10px"}}/>
                    Garden Shop
                </Menu.Item>
                <Menu.Item name='stores' 
                    active={activeItem === 'stores'}
                    onClick={()=>handleItemClick('stores')}/>
                <Menu.Item>
                    <Button positive content='Create Store'
                    onClick={openForm}/>
                </Menu.Item>
                <Menu.Menu position='right'>
                <Menu.Item
                    name='logout'
                    active={activeItem === 'logout'}
                    onClick={()=>handleItemClick('logout')}
                    />
                </Menu.Menu>
            </Container>
        </Menu>
    )
}