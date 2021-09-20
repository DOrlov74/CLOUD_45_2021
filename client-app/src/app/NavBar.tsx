import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Header, Menu } from "semantic-ui-react";
import { UserContext } from "../components/UserProvider";

interface Props{
    activeItem: string;
    logout: ()=>void;
}

export default function NavBar({activeItem='home', logout}: Props){
    const userCtx=React.useContext(UserContext);
    return(
        <Menu pointing secondary>
            <Container>
                <Menu.Item as={NavLink} to='/' exact header name='home'
                    active={activeItem === 'home'}>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:"10px"}}/>
                    <Header as='h3'>Garden Shop</Header>
                </Menu.Item>
                <Menu.Item as={NavLink} to='/store' name='stores' 
                    active={activeItem === 'stores'}/>
                <Menu.Item as={NavLink} to='/product' name='products' 
                    active={activeItem === 'products'}/>
                <Menu.Item>
                    <Button as={NavLink} to='/newstore' positive content='Create Store'/>
                </Menu.Item>
                <Menu.Item>
                    <Button as={NavLink} to='/newproduct' positive content='Create Product'/>
                </Menu.Item>
                <Menu.Menu position='right'>
                <Menu.Item>
                    {userCtx.user === null ? "" : userCtx.user.username}
                </Menu.Item>
                {(userCtx.user != null)?
                <Menu.Item
                    name='logout'
                    active={activeItem === 'logout'}
                    onClick={logout}
                    />: <>
                <Menu.Item as={NavLink} to='/login'
                    name='login'
                    active={activeItem === 'login'}/>
                <Menu.Item as={NavLink} to='/register'
                    name='register'
                    active={activeItem === 'register'}/>
                    </>} 
                </Menu.Menu>
            </Container>
        </Menu>
    )
}