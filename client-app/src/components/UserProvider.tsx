import React, { createContext, useEffect, useState } from "react";
import api from "../app/api";
import { User, UserContextType } from "../models/user";

const userContextDefault: UserContextType = {
    user: null
}

export const UserContext=createContext<UserContextType>(userContextDefault);

interface Props{
    children: React.ReactNode;
}

export default function UserProvider({children}: Props){
    const [user, setUser] = useState<User|null>(null);
    useEffect(() => {
        //  fetch('https://localhost:49153/api/account',
        // {method: 'GET',
        // cache: 'no-cache',
        // headers: {
        //     'Content-Type': 'application/json'
        // }
        // })
        // .then((response) => {
        //     console.log(response);
        //     let resp = JSON.stringify(response);
        //     return JSON.parse(resp);
        //     // return response.json();
        // })
        // .then((data) => {
        //     console.log(data);
        //     setUser(data);
        // })
        
        api.Account.current()
        .then(response => {
            console.log(response);
            setUser(response);
        })
        .catch((err)=>{
            console.log(err);
        });
      }, [user])

    return(
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    );
}