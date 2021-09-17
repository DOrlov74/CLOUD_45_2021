import { Pos } from "./Pos";
import { Stock } from "./stock";

export interface Store {
    Id: string;
    StoreName: string;
    StoreAddress: string;
    Active: boolean;
    Pos: Pos[];
    Stocks: Stock[];
}