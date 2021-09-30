import { Family } from "./family";
import { Product } from "./product";
import { SalesDetail } from "./salesdetail";

export interface Sale {
    SaleId: string;
    SaleDocNum: string;
    Store: string;
    POSNum: string;
    POSUser: string;
    Paid: boolean;
    SalesDetails: SalesDetail[];
}

export interface SaleContext {
    userSales: Sale[];
    activeSale: Sale|null;
    setActiveSale: any;
    userSalesDetails: SalesDetail[];
    setUserSalesDetails: any,
    activeSalesDetails: SalesDetail[];
    setActiveSalesDetails: any,
    products: Product[],
    setProducts: any,
    families: Family[],
    cartProducts: Product[],
    fillUserSales: any,
    fillCartProducts: any,
    fillUserSalesDetails: any,
    fillActiveSalesDetails: any
}