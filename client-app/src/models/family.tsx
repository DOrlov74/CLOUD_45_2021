import { Product } from "./product";

export interface Family {
    FamilyId: string;
    FamilyName: string;
    Products: Product[];
}