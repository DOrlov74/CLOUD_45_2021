import React, { createContext, useEffect, useState } from "react";
import api from "../app/api";
import { Sale, SaleContext } from "../models/sale";
import { UserContext } from "./UserProvider";

const saleContextDefault: SaleContext = {
    userSales: [],
    activeSale: null,
    setSale: null
}

export const CartContext=createContext<SaleContext>(saleContextDefault);

interface Props{
    children: React.ReactNode;
}

export default function CartProvider({children}: Props){
    const userCtx=React.useContext(UserContext);
    const [sales, setSales] = useState<Sale[]|null>(null);
    const [userSales, setUserSales] = useState<Sale[]>([]);
    const newSale={
        SaleId: '',
        SaleDocNum: '',
        Store: '',
        POSNum: '',
        POSUser: userCtx.user ? userCtx.user.Id : '',
        Paid: false,
        SalesDetails: []
    }
    const [activeSale, setActiveSale] = useState<Sale>(newSale);
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
        if(userCtx.user!==null && userCtx.user.Sales !== undefined){
            setUserSales(userCtx.user.Sales);
        }
    }, [userCtx.user])
    useEffect(()=>{
        if(userSales.length>0 && userSales.some((s)=>s.Paid===false)){
            const unpaidSale = userSales.find((s)=>s.Paid===false);
            const activeUserSale = sales?.find(s=>s.SaleId === unpaidSale?.SaleId)
            setActiveSale(activeUserSale!==undefined ? activeUserSale : newSale);
        } else{
            if(userCtx.user!==null){
                createSale(newSale);
            }
        }
    }, [userSales])

    function setSale(sale: Sale){
        setActiveSale(sale);
    }

    function createSale(sale: Sale){
        try{
            api.Sales.create(sale)
            .then((response)=>{
                if(response!==null){
                    setActiveSale(response);
                }
            });
        } catch (err: any){
            console.log(err);
        }  
    }

    return(
        <CartContext.Provider value={{userSales, activeSale, setSale}}>
            {children}
        </CartContext.Provider>
    );
}