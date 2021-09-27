export interface SalesDetail {
    SalesDetailId: string;
    SaleID: string;
    Seq: number;
    Product: string;
    Quantity: number;
    UnitPrice: number|null;
    LineTotal: number;
}