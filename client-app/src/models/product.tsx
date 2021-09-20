import { Stock } from "./stock";

export interface Product {
    ProductId: string;
    Barcode: string;
    ProductName: string;
    FamilyId: string;
    UnitMeasure: string;
    QuantityPerUnit: number;
    UnitPrice: number|null;
    Discontinued: boolean;
    Stocks: Stock[];
}
