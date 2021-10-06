import React from "react";
import { Link } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";
import { UserContext } from "./UserProvider";

export default function HomePage(){
    const userCtx=React.useContext(UserContext);
    return(
        <Container>
            <Header as='h2'>Home page</Header>
            
            <Header as='h4' block>
                {(userCtx.user === null)?
                <p>Welcome to my Garden shop!
                Please <Link to='/login'>login</Link> to buy something. </p>
                :
                <p><strong>{userCtx.user.UserName}</strong>, welcome back to my Garden shop!
                Nice to see you again. </p>
                }
            </Header>
        </Container>
    );
}