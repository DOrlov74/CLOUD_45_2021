import React, { createContext, useEffect, useState } from "react";
import api from "../app/api";
import { Family } from "../models/family";
import { Product } from "../models/product";
import { Sale, SaleContext } from "../models/sale";
import { SalesDetail } from "../models/salesdetail";
import { UserContext } from "./UserProvider";

const saleContextDefault: SaleContext = {
    userSales: [],
    activeSale: null,
    setActiveSale: null,
    userSalesDetails: [],
    setUserSalesDetails: null,
    activeSalesDetails: [],
    setActiveSalesDetails: null,
    products: [],
    setProducts: null,
    families: [],
    cartProducts: [],
    fillUserSales: null,
    fillCartProducts: null,
    fillUserSalesDetails: null,
    fillActiveSalesDetails: null,
    clearCart: null
}

export const CartContext=createContext<SaleContext>(saleContextDefault);

interface Props{
    children: React.ReactNode;
}

export default function CartProvider({children}: Props){
    const userCtx=React.useContext(UserContext);
    const [sales, setSales] = useState<Sale[]|null>(null);
    const [salesDetails, setSalesDetails] = useState<SalesDetail[]|null>(null);
    const [userSales, setUserSales] = useState<Sale[]>([]);
    const [products, setProducts]=useState<Product[]>([]);
    const [families, setFamilies]=useState<Family[]>([]);
    const [cartProducts, setcartProducts]=useState<Product[]>([]);
    const newSale={
        SaleId: '',
        SaleDocNum: '',
        Store: '',
        POSNum: '',
        POSUser: userCtx.user ? userCtx.user.Id : '',
        Paid: false,
        SalesDetails: [],
    }
    const [activeSale, setActiveSale] = useState<Sale>(newSale);
    const [userSalesDetails, setUserSalesDetails]=useState<SalesDetail[]>([]);
    const [activeSalesDetails, setActiveSalesDetails]=useState<SalesDetail[]>([]);

    useEffect(() => {
        fillSales();
        fillSalesDetails();
        fillProducts();
        fillFamilies();
        }, []);

    useEffect(()=>{
        fillUserSales();
    }, [userCtx.user])

    useEffect(()=>{
        fillCartProducts();
        fillActiveSalesDetails();
    }, [activeSale])

    useEffect(()=>{
        fillUserSalesDetails();        
    }, [userSales])

    function fillSales(){
        api.Sales.list().then(response => {
            setSales(response);
          })
          .catch((err)=>{
              console.log(err);
          });
    }

    function fillSalesDetails(){     
        api.SalesDetails.list().then(response => {
            setSalesDetails(response);
          })
          .catch((err)=>{
              console.log(err);
          });
    }

    function fillProducts(){
        api.Products.list().then(response => {
            setProducts(response);
          }).catch((err)=>{
              console.log(err);
          });
    }

    function fillFamilies(){
        api.Families.list().then(response => {
            setFamilies(response);
          }).catch((err)=>{
              console.log(err);
          });
    }

    function fillUserSales(){
        const uSales = userCtx.user?.Sales;
        if(userCtx.user!==null && uSales !== undefined){
            setUserSales(uSales);
            console.log('user sales updated');
            if(uSales.length>0 && uSales.some((s)=>s.Paid===false)){
                const unpaidSale = uSales.find((s)=>s.Paid===false);
                const activeUserSale = sales?.find(s=>s.SaleId === unpaidSale?.SaleId)
                if(activeUserSale!==undefined){
                    setActiveSale(activeUserSale);
                    console.log('active sale updated');
                }
            } else{
                if(userCtx.user!==null){
                    createSale(newSale);
                }
            }
        }
    }

    function fillUserSalesDetails(){
        if(userSales.length >0){
            console.log('userSale count '+ userSales.length);
            // if(userSalesDetails.length > 0){
            //     setUserSalesDetails([]);
            //     console.log("User Sales Details Cleared");
            // }
            userSales.map(s=>{
                const saleDetail = salesDetails?.find(d=>d.SaleId === s.SaleId);
                console.log('Product found in User order: ' + saleDetail?.Product);
                if(saleDetail !== undefined && !userSalesDetails.some(d => d.SalesDetailId === saleDetail.SalesDetailId)){
                    setUserSalesDetails([...userSalesDetails, saleDetail]);
                    console.log("User Sale Detail updated")
                } 
            })
        }
    }

    function fillCartProducts(){
        if(activeSale?.SalesDetails !== []){
            // if(cartProducts.length > 0){
            //     setcartProducts([]);
            // }
            activeSale?.SalesDetails.map(d=>{
                const product = products.find(p=>p.ProductId === d.Product);
                console.log('Product in Cart:' + product?.ProductName)
                if(product !== undefined && !cartProducts.some(p=>p.ProductId === product.ProductId)){
                    setcartProducts([...cartProducts, product]);
                    console.log('cart products updated');
                }
            });
        }
    }

    function fillActiveSalesDetails(){
        if(activeSale.SalesDetails.length >0){
            // if(activeSalesDetails.length > 0){
            //     setActiveSalesDetails([]);
            //     console.log("Active Sales Details Cleared");
            // }
            activeSale.SalesDetails.map(d => {
                const detail = salesDetails?.find(sd => sd.SalesDetailId === d.SalesDetailId);
                if(detail !== undefined && !activeSalesDetails.some(d => d.SalesDetailId === detail.SalesDetailId)){
                    setActiveSalesDetails([...activeSalesDetails, detail]);
                    console.log(`active cart product details with id: ${detail.Product} updated`);
                }
            })
        }
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

    function clearCart(){
        setUserSales([]);
        setcartProducts([]);
        setActiveSale(newSale);
        setUserSalesDetails([]);
        setActiveSalesDetails([]);
    }

    return(
        <CartContext.Provider value={{
            userSales, activeSale, setActiveSale, 
            userSalesDetails, setUserSalesDetails,
            activeSalesDetails, setActiveSalesDetails, 
            products, setProducts, 
            families, cartProducts, 
            fillUserSales, fillCartProducts,
            fillUserSalesDetails,
            fillActiveSalesDetails,
            clearCart}}>
            {children}
        </CartContext.Provider>
    );
}