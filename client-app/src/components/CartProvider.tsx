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
        Id: '',
        SaleDocNum: '',
        Store: '',
        POSNum: '',
        POSUser: userCtx.user ? userCtx.user.id : '',
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
        if(userCtx.user!==null){
            setUserSales(userCtx.user.sales);
        }
    }, [userCtx.user])
    useEffect(()=>{
        if(userSales!==[] && userSales.some((s)=>s.Paid===false)){
            const unpaidSale = userSales.find((s)=>s.Paid===false);
            setActiveSale(unpaidSale!==undefined ? unpaidSale : newSale);
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