import { Sale } from "./sale";

export interface Pos {
    Id: string;
    StoreId: string;
    StoreLocation: string;
    Sales: Sale[];
}