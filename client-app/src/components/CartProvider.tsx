import React, { createContext, useEffect, useState } from "react";
import api from "../app/api";
import { Sale, SaleContext } from "../models/sale";
import { UserContext } from "./UserProvider";

const saleContextDefault: SaleContext = {
    userSales: [],
    activeSale: null
}

export const CartContext=createContext<SaleContext>(saleContextDefault);

interface Props{
    children: React.ReactNode;
}

export default function CartProvider({children}: Props){
    const userCtx=React.useContext(UserContext);
    const [sales, setSales] = useState<Sale[]|null>(null);
    const [userSales, setUserSales] = useState<Sale[]>([]);
    const [activeSale, setActiveSale] = useState<Sale|null>(null);
    useEffect(() => {
        api.Sales.list().then(response => {
            console.log(response);
            setSales(response);
          })
          .catch((err)=>{
              console.log(err);
          });
        }, []);
    useEffect(()=>{
        if(userCtx.user!==null){
            setUserSales(userCtx.user.sales);
        }
    }, [userCtx.user])
    return(
        <CartContext.Provider value={{userSales, activeSale}}>
            {children}
        </CartContext.Provider>
    );
}