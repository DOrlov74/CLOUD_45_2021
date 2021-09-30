import React, { createContext, useEffect, useState } from "react";
import { setTokenSourceMapRange } from "typescript";
import api from "../app/api";
import { Role, User, UserContextType } from "../models/user";

const userContextDefault: UserContextType = {
    user: null,
    setUser: null,
    userRoles: [],
    setUserRoles: null,
    roles: [],
    setRoles: null,
    userToken: null,
    setToken: null,
    getCurrentUser: null
}

export const UserContext=createContext<UserContextType>(userContextDefault);

interface Props{
    children: React.ReactNode;
}

export default function UserProvider({children}: Props){
    const [user, setUser] = useState<User|null>(null);
    const [roles, setRoles]=useState<Role[]>([]);
    const [userRoles, setUserRoles] = useState<Role[]>([]);
    const [userToken, setUserToken] = useState<string|null>(window.localStorage.getItem('jwt'))
    useEffect(()=>{
        api.Roles.list().then(response => {
            if(response!==null) setRoles(response);
        }).catch((err)=>{
            console.log(err);
        });
    }, [])
    useEffect(()=>{
        setUserRoles([]);
        user?.Roles.map(r=>{
            const role = roles.find(x=>x.Id === r);
            if(role !== undefined && !userRoles.some(x=>x.Id === r)) {
                setUserRoles([...userRoles, role]);
            }
        });
    }, [user, roles])
    // It's just a test:
    // useEffect(() => {
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
    //     getCurrentUser();
    //   }, [user])

    // async function getCurrentUser(){
    //     await api.Account.current()
    //     .then(response => {
    //         console.log(response);
    //         setUser(response);
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     });
    // }

    function getCurrentUser(){
        if(userToken !== null){
            console.log('Trying to get user ...');    
            api.Users.current()
                .then(response => {
                    console.log(response);
                    setUser(response);
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        }

    function setToken(token: string){
        if(token) {
            window.localStorage.setItem('jwt', token);
            setUserToken(token);
        }
    }

    return(
        <UserContext.Provider value={{user, setUser, userRoles, setUserRoles, roles, setRoles, userToken, setToken, getCurrentUser}}>
            {children}
        </UserContext.Provider>
    );
}