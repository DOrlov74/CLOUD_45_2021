import React, { createContext, useEffect, useState } from "react";
import api from "../app/api";
import { Role, User, UserContextType } from "../models/user";

const userContextDefault: UserContextType = {
    user: null,
    setUser: null,
    userRoles: [],
    setUserRoles: null,
    roles: [],
    setRoles: null
}

export const UserContext=createContext<UserContextType>(userContextDefault);

interface Props{
    children: React.ReactNode;
}

export default function UserProvider({children}: Props){
    const [user, setUser] = useState<User|null>(null);
    const [roles, setRoles]=useState<Role[]>([]);
    const [userRoles, setUserRoles] = useState<Role[]>([]);
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

    async function getCurrentUser(){
        await api.Account.current()
        .then(response => {
            console.log(response);
            setUser(response);
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    return(
        <UserContext.Provider value={{user, setUser, userRoles, setUserRoles, roles, setRoles}}>
            {children}
        </UserContext.Provider>
    );
}