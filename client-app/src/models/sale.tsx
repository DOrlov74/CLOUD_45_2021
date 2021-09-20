import { SalesDetail } from "./salesdetail";

export interface Sale {
    Id: string;
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
    setSale: any;
}