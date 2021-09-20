export interface SalesDetail {
    Id: string;
    SaleID: string;
    Seq: string;
    Product: string;
    Quantity: number;
    UnitPrice: number|null;
    LineTotal: number;
}