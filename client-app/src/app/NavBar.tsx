import React, {MouseEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Header, Icon, Menu } from "semantic-ui-react";
import { CartContext } from "../components/CartProvider";
import { UserContext } from "../components/UserProvider";

interface Props{
    logout: ()=>void;
}

export default function NavBar({logout}: Props){
    const userCtx=React.useContext(UserContext);
    const cartCtx=React.useContext(CartContext);
    const [activeItem, setActiveItem] = useState<string>('home');

    function handleClick(event: MouseEvent){
        console.log(event);
        const target=event.target as HTMLAnchorElement;
        setActiveItem(target.name);
    }
    return(
        <Menu pointing secondary>
            <Container>
                <Menu.Item as={NavLink} to='/' exact header name='home'
                    active={activeItem === 'home'} onClick={handleClick}>
                    <Icon name='sun' size='big' color='orange'/>
                    {/* <img src="/assets/logo.png" alt="logo" style={{marginRight:"10px"}}/> */}
                    <Header as='h3' color='orange'>Garden Shop</Header>
                </Menu.Item>
                {userCtx.userRoles.some((r)=>r.Name === "admin")?
                <Menu.Item as={NavLink} to='/store' name='stores' 
                    active={activeItem === 'stores'} onClick={handleClick}/>:
                <></>}
                <Menu.Item as={NavLink} to='/product' name='products' 
                    active={activeItem === 'products'} onClick={handleClick}/>
                <Menu.Menu position='right'>
                    <Menu.Item as={NavLink} to={`/cartlist/${cartCtx.activeSale?.SaleId}`} name='cartlist' onClick={handleClick}>
                        <Icon disabled={userCtx.user === null} name='cart' size='large' onClick={handleClick}/>
                    </Menu.Item>
                    {(userCtx.user !== null)?
                    <>
                    <Menu.Item as={NavLink} to={`/edituser/${userCtx.user.Id}`} name='setting' onClick={handleClick}>
                    {userCtx.user.UserName}
                    <Icon name='setting' size='large' style={{marginLeft:"10px"}} />
                    </Menu.Item>
                    <Menu.Item
                        name='logout'
                        active={activeItem === 'logout'}
                        onClick={logout}
                        />
                    </>: <>
                    <Menu.Item as={NavLink} to='/login'
                        name='login'
                        active={activeItem === 'login'} onClick={handleClick}/>
                    <Menu.Item as={NavLink} to='/register'
                        name='register'
                        active={activeItem === 'register'} onClick={handleClick}/>
                        </>} 
                </Menu.Menu>
            </Container>
        </Menu>
    )
}